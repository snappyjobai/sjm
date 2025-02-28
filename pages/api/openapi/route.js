import { NextResponse } from "next/server";

export async function GET() {
  const openApiSpec = {
    openapi: "3.0.0",
    info: {
      title: "Snapjobs API Documentation",
      version: "1.0.0",
      description: "Enterprise-grade AI-powered talent matching system",
    },
    // ...rest of your OpenAPI specification...
    paths: {
      "/match": {
        post: {
          summary: "Match freelancers to project",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProjectRequest",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Successful matching results",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/MatchResponse",
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        ProjectRequest: {
          type: "object",
          properties: {
            description: {
              type: "string",
            },
            required_skills: {
              type: "array",
              items: {
                type: "string",
              },
            },
            budget_range: {
              type: "array",
              items: {
                type: "number",
              },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(openApiSpec, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
}
