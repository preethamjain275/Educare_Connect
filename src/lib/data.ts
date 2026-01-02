
export interface User {
    id: number;
    name: string;
    email: string;
    role: "Student" | "Parent" | "Teacher" | "Doctor" | "Admin";
    status: string;
    joined: string;
    srn?: string;        // For Student
    linkedSrn?: string;  // For Parent
    phone?: string;
    password?: string;
    vanDriverPhone?: string;
    routeNumber?: string;
}

const INITIAL_USERS: User[] = [
    { id: 1, name: "Preetham Jain", email: "alex@student.edu", role: "Student", status: "Active", joined: "Aug 2024", srn: "24Suube001", password: "password123" },
    { id: 2, name: "Sarah Smith", email: "sarah@parent.com", role: "Parent", status: "Active", joined: "Aug 2024", linkedSrn: "24Suube001", password: "password123" },
    { id: 3, name: "Mr. Williams", email: "williams@teacher.edu", role: "Teacher", status: "Active", joined: "Jun 2023", password: "password123" },
    { id: 4, name: "Dr. Brown", email: "brown@doctor.edu", role: "Doctor", status: "Active", joined: "Jan 2024", password: "password123" },
    { id: 5, name: "Emma Wilson", email: "emma@student.edu", role: "Student", status: "Inactive", joined: "Sep 2024", srn: "24Suube002", password: "password123" },
    { id: 6, name: "John Davis", email: "john@student.edu", role: "Student", status: "Active", joined: "Aug 2024", srn: "24Suube003", password: "password123" },
    { id: 7, name: "Mrs. Taylor", email: "taylor@teacher.edu", role: "Teacher", status: "Active", joined: "Mar 2023", password: "password123" },
    { id: 8, name: "Admin User", email: "admin@example.com", role: "Admin", status: "Active", joined: "Jan 2023", password: "password123" }
];

// ... (keep middle content same)

const INITIAL_EVENTS: Event[] = [
    {
        id: 1,
        title: "Annual Sports Day",
        date: "2025-01-15",
        type: "Sports",
        description: "Track and field events for all classes.",
        link: "https://forms.google.com/sports-day",
        registeredStudents: []
    },
    {
        id: 2,
        title: "Science Exhibition",
        date: "2025-01-22",
        type: "Academic",
        description: "Projects display by Class 9-12.",
        link: "https://forms.google.com/science-fair",
        registeredStudents: []
    },
    {
        id: 3,
        title: "Hackathon 2025",
        date: "2025-02-10",
        type: "Academic",
        description: "24-hour coding marathon for students.",
        link: "https://forms.google.com/hackathon",
        registeredStudents: []
    }
];
