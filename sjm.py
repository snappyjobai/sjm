import os
import re
import uuid
import json
import logging
import sys
import csv
import socket
from typing import List, Dict, Optional, Any
from dataclasses import dataclass
from difflib import SequenceMatcher

import nltk
nltk.download('punkt')
nltk.download('stopwords')
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rake_nltk import Rake
import numpy as np

# Global logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

# Data classes
@dataclass
class Freelancer:
    id: str
    username: str
    name: str
    job_title: str
    skills: List[str]
    experience: int
    rating: float
    hourly_rate: float
    profile_url: str
    availability: bool
    total_sales: int
    description: str = ""

@dataclass
class Project:
    id: str
    description: str
    required_skills: List[str]
    budget_range: tuple
    complexity: str
    timeline: int

# Skills extraction class combining functionalities from both versions
class SkillsExtract:
    def __init__(self, claude_api_key: Optional[str] = None, openai_api_key: Optional[str] = None):
        self.claude_api_key = claude_api_key or os.getenv('CLAUDE_API_KEY')
        self.openai_api_key = openai_api_key or os.getenv('OPENAI_API_KEY')
        stop_words = set(stopwords.words('english'))
        self.stop_words = stop_words - {'need', 'needed', 'want', 'looking', 'developer', 'designer', 'manager', 'expert', 'senior', 'junior', 'level'}
        self.tfidf_vectorizer = TfidfVectorizer(stop_words=self.stop_words)
        self.rake = Rake()
        self.manual_keywords = []
        self.job_titles = set()
        self.known_skills = set()
        logger.info("SkillsExtract initialized.")

    def load_keywords_from_database(self, freelancers: List[Freelancer]) -> None:
        for f in freelancers:
            self.known_skills.update(f.skills)
            self.job_titles.add(f.job_title)
        self.manual_keywords = list(self.known_skills | self.job_titles)
        logger.info("Loaded keywords from freelancers.")

    def clean_skill(self, skill: str) -> str:
        cleaned = re.sub(r'[\[\]"×\+\(\)]', '', skill.strip())
        tech_formats = {
            'adobe xd': 'Adobe XD',
            'blender': 'Blender',
            'figma': 'Figma',
            'color theory': 'Color Theory',
            'unreal engine': 'Unreal Engine',
            'react': 'React.js',
            'reactjs': 'React.js',
            'node': 'Node.js',
            'nodejs': 'Node.js',
            'vue': 'Vue.js',
            'vuejs': 'Vue.js',
            'typescript': 'TypeScript',
            'javascript': 'JavaScript',
            'nextjs': 'Next.js',
            'nuxtjs': 'Nuxt.js',
            'expressjs': 'Express.js',
        }
        cleaned_lower = cleaned.lower()
        if cleaned_lower in tech_formats:
            return tech_formats[cleaned_lower]
        return cleaned.capitalize()

    def extract_skills(self, text: str) -> List[str]:
        if not text:
            return []
        cleaned_text = re.sub(r'[\[\]"×\+]', '', text)
        words = word_tokenize(cleaned_text.lower())
        matched_skills = set()
        self.rake.extract_keywords_from_text(text)
        keywords = self.rake.get_ranked_phrases()
        for kw in keywords:
            kw_clean = self.clean_skill(kw)
            matched_skills.add(kw_clean)
        return sorted(list(matched_skills))

    def verify_keyword(self, keyword: str) -> Dict[str, Any]:
        if not keyword:
            return self._empty_verification_result()
        cleaned_keyword = self.clean_skill(keyword)
        found_skills = {skill for skill in self.known_skills if cleaned_keyword.lower() == skill.lower()}
        found_titles = {title for title in self.job_titles if cleaned_keyword.lower() == title.lower()}
        if found_skills or found_titles:
            return {
                'exists': True,
                'similar_terms': [],
                'type': 'skill' if found_skills else 'job_title',
                'matches': list(found_skills or found_titles),
                'skills': list(found_skills),
                'job_titles': list(found_titles)
            }
        similar_terms = self._find_database_similar_terms(cleaned_keyword)
        return {
            'exists': False,
            'similar_terms': similar_terms,
            'type': None,
            'matches': [],
            'skills': [],
            'job_titles': []
        }

    def _find_database_similar_terms(self, keyword: str) -> List[str]:
        similar = []
        keyword_lower = keyword.lower()
        all_terms = list(self.known_skills) + list(self.job_titles)
        for term in all_terms:
            similarity = SequenceMatcher(None, keyword_lower, term.lower()).ratio()
            if similarity > 0.6:
                similar.append(term)
        return sorted(similar)[:5]

    def _empty_verification_result(self) -> Dict[str, Any]:
        return {
            'exists': False,
            'similar_terms': [],
            'type': None,
            'matches': [],
            'skills': [],
            'job_titles': []
        }

# Collaborative model for hybrid matching
class CollaborativeModel:
    def __init__(self):
        self.interaction_matrix = None
        self.freelancer_data = []
        self.project_data = []

    def train(self, project_data: List[Dict], freelancer_data: List[Freelancer]):
        self.freelancer_data = freelancer_data
        self.project_data = project_data
        num_freelancers = len(freelancer_data)
        if num_freelancers == 0:
            self.interaction_matrix = np.zeros((num_freelancers, 2))
            return
        total_sales = np.array([f.total_sales for f in freelancer_data])
        ratings = np.array([f.rating for f in freelancer_data])
        if total_sales.max() - total_sales.min() != 0:
            total_sales_norm = (total_sales - total_sales.min()) / (total_sales.max() - total_sales.min())
        else:
            total_sales_norm = total_sales
        ratings_norm = ratings  # assuming rating is on a 0-5 scale already
        self.interaction_matrix = np.column_stack((total_sales_norm, ratings_norm))

    def predict(self, project_description: str, project_skills: List[str]) -> List[float]:
        if self.interaction_matrix is None or self.interaction_matrix.size == 0:
            return [0.0] * len(self.freelancer_data)
        scores = np.nanmean(self.interaction_matrix, axis=1)
        return np.nan_to_num(scores).tolist()

# Content-based model for profile matching
class ContentBasedModel:
    def __init__(self):
        self.freelancer_profiles = []

    def train(self, freelancer_data: List[Freelancer]):
        corpus = [" ".join(f.skills) for f in freelancer_data]
        self.freelancer_profiles = self._vectorize(corpus)

    def _vectorize(self, corpus: List[str]):
        vectorizer = TfidfVectorizer()
        return vectorizer.fit_transform(corpus)

    def predict(self, project_tfidf):
        similarities = cosine_similarity(project_tfidf, self.freelancer_profiles)
        return similarities.flatten().tolist()

# Matching engine combining collaborative and content-based methods
class MatchingEngine:
    def __init__(self, freelancers: List[Freelancer], projects: List[Project], skill_extractor: SkillsExtract, collaborative_model: Optional[CollaborativeModel] = None):
        self.freelancers = freelancers
        self.projects = projects
        self.skill_extractor = skill_extractor
        self.collaborative_model = collaborative_model or CollaborativeModel()
        self.content_model = ContentBasedModel()
        self.weights = {
            'content': 0.4,
            'collaborative': 0.4,
            'experience': 0.1,
            'rating': 0.1
        }

    def train_models(self):
        self.skill_extractor.load_keywords_from_database(self.freelancers)
        self.content_model.train(self.freelancers)
        project_data = [vars(p) for p in self.projects]
        self.collaborative_model.train(project_data, self.freelancers)

    def _get_content_scores(self, project: Project) -> List[float]:
        vectorizer = TfidfVectorizer()
        proj_vec = vectorizer.fit_transform([" ".join(project.required_skills)])
        return self.content_model.predict(proj_vec)

    def match_freelancers(self, project: Project, weights: Optional[Dict[str, float]] = None, page: int = 1) -> List[Dict[str, Any]]:
        weights = weights or self.weights
        self.train_models()
        content_scores = self._get_content_scores(project)
        collaborative_scores = self.collaborative_model.predict(project.description, project.required_skills)
        matches = []
        for i, freelancer in enumerate(self.freelancers):
            experience_score = min(freelancer.experience / 10, 1)
            rating_score = freelancer.rating / 5 if freelancer.rating <= 5 else 1
            combined = (weights['content'] * content_scores[i] +
                        weights['collaborative'] * collaborative_scores[i] +
                        weights['experience'] * experience_score +
                        weights['rating'] * rating_score)
            matches.append({
                'freelancer': freelancer,
                'combined_score': combined
            })
        matches.sort(key=lambda x: x['combined_score'], reverse=True)
        return matches

    def refine_skill_matching(self, required_skills: List[str], freelancer_skills: List[str]) -> int:
        return len(set(required_skills) & set(freelancer_skills))

    def get_top_matches(self, project: Project, top_n: int = 5) -> List[Dict[str, Any]]:
        all_matches = self.match_freelancers(project)
        return all_matches[:top_n]

# CSV normalization to create Freelancer objects
def normalize_csv(file_path: str, csv_columns: Optional[Dict[str, str]] = None) -> List[Freelancer]:
    csv_columns = csv_columns or {
        'id': 'id',
        'freelancername': 'freelancername',
        'name': 'name',
        'job_title': 'job_title',
        'skills': 'skills',
        'experience': 'experience',
        'rating': 'rating',
        'hourly_rate': 'hourly_rate',
        'profile_url': 'profile_url',
        'availability': 'availability',
        'total_sales': 'total_sales'
    }
    freelancers = []
    with open(file_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            freelancer = Freelancer(
                id=row.get(csv_columns['id'], ""),
                username=row.get(csv_columns.get('freelancername', 'name'), ""),
                name=row.get(csv_columns.get('name', 'name'), ""),
                job_title=row.get(csv_columns['job_title'], ""),
                skills=[s.strip() for s in row.get(csv_columns['skills'], "").split(',') if s.strip()],
                experience=int(row.get(csv_columns['experience'], "0")),
                rating=float(row.get(csv_columns['rating'], "0")),
                hourly_rate=float(row.get(csv_columns['hourly_rate'], "0")),
                profile_url=row.get(csv_columns['profile_url'], ""),
                availability=(row.get(csv_columns['availability'], "True") == "True"),
                total_sales=int(row.get(csv_columns['total_sales'], "0"))
            )
            freelancers.append(freelancer)
    return freelancers

# Simple server for communication use cases
class Server:
    def __init__(self, host='127.0.0.1', port=65432):
        self.host = host
        self.port = port
        self.socket = None
        self.conn = None

    def setup_server(self):
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.bind((self.host, self.port))
        self.socket.listen(1)
        logger.info("Server setup complete.")

    def start_server(self):
        self.setup_server()
        self.conn, addr = self.socket.accept()
        logger.info(f"Connected by {addr}")

    def send_message(self, message):
        if self.conn:
            self.conn.sendall(message.encode('utf-8'))

    def receive_message(self):
        if self.conn:
            data = self.conn.recv(4096)
            return data.decode('utf-8')
        return ""

    def close_connection(self):
        if self.conn:
            self.conn.close()
        if self.socket:
            self.socket.close()
        logger.info("Server closed.")
