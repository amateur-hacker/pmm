// utils/mock-data.ts

// Function to generate mock members data
export function generateMockMembers(count: number = 50) {
  const members = [];
  const names = [
    "Rajesh Kumar",
    "Priya Sharma",
    "Amit Singh",
    "Sunita Devi",
    "Sanjay Patel",
    "Rita Verma",
    "Vikash Yadav",
    "Pooja Mishra",
    "Rahul Sharma",
    "Sneha Singh",
    "Anil Gupta",
    "Kavita Kumari",
    "Rohit Verma",
    "Sushma Devi",
    "Manoj Tiwari",
    "Kiran Sharma",
    "Rakesh Patel",
    "Priyanka Singh",
    "Vivek Sharma",
    "Anita Devi",
    "Sunil Kumar",
    "Neha Singh",
    "Alok Mishra",
    "Sunita Sharma",
    "Ravi Verma",
    "Poonam Patel",
    "Sandeep Kumar",
    "Rashmi Singh",
    "Rajesh Tiwari",
    "Divya Sharma",
    "Amitabh Singh",
    "Sunita Verma",
    "Sanjay Sharma",
    "Rita Patel",
    "Vikash Singh",
    "Pooja Kumar",
    "Rahul Verma",
    "Sneha Patel",
    "Anil Sharma",
    "Kavita Singh",
    "Rohit Kumar",
    "Sushma Verma",
    "Manoj Sharma",
    "Kiran Patel",
    "Rakesh Verma",
    "Priyanka Kumar",
    "Vivek Patel",
    "Anita Sharma",
    "Sunil Verma",
    "Neha Kumar",
  ];

  const educationLevels = [
    "High School",
    "Diploma",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
  ];

  for (let i = 0; i < count; i++) {
    const name = names[i % names.length];
    const [firstName, lastName] = name.split(" ");
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;

    members.push({
      id: `member-${i + 1}`,
      name: names[i % names.length],
      address: `House No. ${Math.floor(Math.random() * 100) + 1}, Street ${Math.floor(Math.random() * 20) + 1}, ${["Delhi", "Mumbai", "Kolkata", "Patna", "Gaya", "Varanasi", "Lucknow", "Gorakhpur"][Math.floor(Math.random() * 8)]}`,
      mobile: `+91-${Math.floor(7000000000 + Math.random() * 3000000000)}`,
      email,
      dob: new Date(
        1970 + Math.floor(Math.random() * 40),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
      )
        .toISOString()
        .split("T")[0],
      education:
        educationLevels[Math.floor(Math.random() * educationLevels.length)],
      permanentAddress: `Village ${["Rampur", "Shivpur", "Kumarapur", "Gandhipur", "Ashoknagar"][Math.floor(Math.random() * 5)]}, Dist. ${["Siwan", "Chapra", "Muzaffarpur", "Darbhanga", "Begusarai"][Math.floor(Math.random() * 5)]}`,
      image: null, // No image for mock data
      donated: Math.floor(Math.random() * 50000),
      type: "member",
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000),
      ).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return members;
}

// Function to generate mock blogs data
export function generateMockBlogs(count: number = 50) {
  const blogs = [];
  const titles = [
    "Community Development Initiatives",
    "Education for All Program",
    "Healthcare Awareness Campaign",
    "Women Empowerment Projects",
    "Agricultural Support Programs",
    "Youth Development Activities",
    "Environmental Conservation Efforts",
    "Cultural Preservation Activities",
    "Disaster Relief Operations",
    "Infrastructure Development in Villages",
    "Microfinance for Women",
    "Digital Literacy Programs",
    "Clean Water Initiatives",
    "Sanitation Projects",
    "Skill Development Workshops",
    "Senior Care Services",
    "Child Welfare Programs",
    "Sports and Recreation Activities",
    "Festivals and Cultural Events",
    "Rural Employment Programs",
    "Health Camps in Villages",
    "Education Scholarship Programs",
    "Senior Citizens Support",
    "Rural Road Development",
    "Vocational Training Centers",
    "Women's Self-Help Groups",
    "Environmental Clean-up Drives",
    "Tree Plantation Campaigns",
    "Renewable Energy Projects",
    "Organic Farming Promotion",
    "Support for Senior Farmers",
    "Youth Skill Development",
    "Community Kitchen Initiatives",
    "Rural Healthcare Services",
    "Literacy Programs",
    "Women Safety Initiatives",
    "Youth Sports Competitions",
    "Community Gardens",
    "Rural Internet Access",
    "Elderly Care Centers",
    "Community Radio Programs",
    "Traditional Art Preservation",
    "Cultural Heritage Projects",
    "Rural Tourism Development",
    "Support for Artisans",
    "Traditional Medicine Practices",
    "Community Festivals",
    "Rural Banking Services",
    "Support for Small Businesses",
    "Traditional Craft Promotion",
    "Community Disaster Preparedness",
  ];

  const authors = [
    "Dr. Rajesh Sharma",
    "Ms. Priya Verma",
    "Mr. Amit Patel",
    "Mrs. Sunita Devi",
    "Dr. Sanjay Singh",
    "Ms. Rita Gupta",
    "Mr. Vikash Yadav",
    "Mrs. Pooja Mishra",
    "Dr. Rahul Sharma",
    "Ms. Sneha Singh",
    "Mr. Anil Kumar",
    "Mrs. Kavita Kumari",
    "Dr. Rohit Verma",
    "Ms. Sushma Devi",
    "Mr. Manoj Tiwari",
  ];

  const excerptTemplates = [
    "This blog discusses our recent efforts in...",
    "An overview of our community development initiatives...",
    "Our latest project aims to improve...",
    "A comprehensive report on our activities...",
    "Updates from our field workers about...",
    "We're excited to share our progress on...",
    "A detailed look at our recent achievements...",
    "An analysis of our ongoing programs...",
    "Our approach to solving community issues...",
    "Insights from our work in rural areas...",
  ];

  const contentTemplates = [
    `## Introduction\nThis is a sample blog post that discusses our work in community development. We believe that collective action can lead to sustainable change in society.\n\n## Our Approach\nWe focus on building local capacity and empowering communities to take ownership of their development.\n\n## Impact\nOur work has directly benefited over 10,000 individuals across 50 villages in the region.`,
    `## Program Overview\nThis post highlights our education initiative which has helped establish 15 new learning centers across rural areas.\n\n## Challenges\nWe faced initial resistance from conservative elements but were able to engage with the community effectively.\n\n## Results\nThe program has resulted in a 40% increase in school enrollment in our target areas.`,
    `## Background\nThe issue of water scarcity affects millions of people in the region, prompting our organization to take action.\n\n## Our Solution\nWe've implemented a multi-pronged approach involving borewell construction and water conservation techniques.\n\n## Future Plans\nWe're planning to expand this program to cover 100 additional villages in the next two years.`,
    `## Context\nWomen's participation in local governance has been limited due to various socio-economic factors.\n\n## Our Initiative\nWe've launched a campaign to train women in leadership and governance skills.\n\n## Outcomes\nSo far, 150 women have been trained, with 30 of them being elected to local government positions.`,
    `## Rationale\nDigital divide is a significant challenge in rural areas, limiting access to information and opportunities.\n\n## Our Program\nWe've established computer centers and are providing free digital literacy classes to the community.\n\n## Impact\nOver 500 community members have completed our digital literacy program so far.`,
  ];

  for (let i = 0; i < count; i++) {
    const title = titles[i % titles.length];
    const content =
      contentTemplates[Math.floor(Math.random() * contentTemplates.length)];
    const excerpt =
      excerptTemplates[Math.floor(Math.random() * excerptTemplates.length)];

    blogs.push({
      id: `blog-${i + 1}`,
      title: `${title} - Part ${i + 1}`,
      content,
      excerpt,
      author: authors[Math.floor(Math.random() * authors.length)],
      published: Math.random() > 0.2 ? 1 : 0, // 80% chance of being published
      publishedAt: new Date(
        Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000),
      ).toISOString(),
      image: `https://picsum.photos/seed/${i}/600/400`,
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000),
      ).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return blogs;
}
