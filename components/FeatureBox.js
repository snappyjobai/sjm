import React from "react";

const FeatureBox = ({ heading, text, actionButton }) => {
  return (
    <div className="feature-box p-8 bg-white rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 mb-6">
      <h3 className="text-2xl font-bold mb-4 text-gray-800 animate-fade-in">
        {heading}
      </h3>
      <p className="text-gray-600 mb-6 leading-relaxed hover:text-gray-700 transition-colors duration-200">
        {text}
      </p>
      {actionButton && (
        <div className="feature-action animate-bounce-subtle">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default FeatureBox;
