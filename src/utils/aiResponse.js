
export const schoolProfile = {
  name: "Eduhub Portal",
  about: {
    founded: 2025,
    type: "Private",
    location: "Springfield, Illinois",
    totalStudents: 360,
    studentTeacherRatio: "10:1",
  },
  academicDetails: {
    classRange: "9-12",
    classSizes: {
      average: 22,
      max: 30,
      min: 15,
    },
    curriculum: [
      "Advanced Placement (AP) Courses",
      "STEM Focus",
      "Arts Program",
    ],
  },
  commonQueries: [
    {
      keywords: ["classes", "courses", "curriculum"],
      response:
        "We offer core subjects, AP courses in Math, Science, and English, plus electives in Computer Science, Arts, and Foreign Languages.",
    },
    {
      keywords: ["class capacity", "class size", "students per class"],
      response:
        "Most classes range from 15-30 students, ensuring personalized attention.",
    },
    {
      keywords: ["number of students", "student population"],
      response: "Eduhub has approximately 360 students.",
    },
  ],

  // Helper method to find response for a query
  findResponse(query) {
    const lowercaseQuery = query.toLowerCase();

    // Check common queries first
    const matchedQuery = this.commonQueries.find((item) =>
      item.keywords.some((keyword) => lowercaseQuery.includes(keyword))
    );

    if (matchedQuery) return matchedQuery.response;

    // Default response if no match
    return "I may not have specific information about that. Could you please contact the school office for detailed inquiries?";
  },
};

export function generateSchoolPrompt(userMessage) {
  return `
    You are an AI assistant for Eduhub Portal. 
    Provide accurate, concise information based on the school's profile.
    If the query is not clearly answerable, suggest contacting the school office.
    
    School Context:
    - Name: Eduhub Portal
    - Location: 123 school Street
    - Grades: Primary 1-6, JSS 1 - SSS 3
    - Total Students: 360
    
    User Query: ${userMessage}
  `;
}
