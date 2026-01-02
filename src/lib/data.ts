
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
    { id: 1, name: "Alex Johnson", email: "alex@student.edu", role: "Student", status: "Active", joined: "Aug 2024", srn: "24Suube001", password: "password123" },
    { id: 2, name: "Sarah Smith", email: "sarah@parent.com", role: "Parent", status: "Active", joined: "Aug 2024", linkedSrn: "24Suube001", password: "password123" },
    { id: 3, name: "Mr. Williams", email: "williams@teacher.edu", role: "Teacher", status: "Active", joined: "Jun 2023", password: "password123" },
    { id: 4, name: "Dr. Brown", email: "brown@doctor.edu", role: "Doctor", status: "Active", joined: "Jan 2024", password: "password123" },
    { id: 5, name: "Emma Wilson", email: "emma@student.edu", role: "Student", status: "Inactive", joined: "Sep 2024", srn: "24Suube002", password: "password123" },
    { id: 6, name: "John Davis", email: "john@student.edu", role: "Student", status: "Active", joined: "Aug 2024", srn: "24Suube003", password: "password123" },
    { id: 7, name: "Mrs. Taylor", email: "taylor@teacher.edu", role: "Teacher", status: "Active", joined: "Mar 2023", password: "password123" },
    { id: 8, name: "Admin User", email: "admin@example.com", role: "Admin", status: "Active", joined: "Jan 2023", password: "password123" }
];

const STORAGE_KEY = "educare_users_v1";

export const dataManager = {
    getUsers: (): User[] => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
            return INITIAL_USERS;
        }
        return JSON.parse(stored);
    },

    addUser: (user: Omit<User, "id" | "joined" | "status">) => {
        const users = dataManager.getUsers();
        const newUser: User = {
            ...user,
            id: Date.now(), // simple ID generation
            status: "Active",
            joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            // Ensure password is set if not provided (default for added users if we want)
            password: user.password || "password123"
        };
        const updatedUsers = [...users, newUser];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
        return newUser;
    },

    updateUser: (updatedUser: User) => {
        const users = dataManager.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        }
    },

    deleteUser: (id: number) => {
        const users = dataManager.getUsers().filter(u => u.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    },

    // Helper to find a user by credentials
    authenticate: (identifier: string, password: string, role: string): { user: User | null, error?: string } => {
        const users = dataManager.getUsers();

        // For students, identifier is SRN
        if (role === "student") {
            // Find by SRN (identifier) directly first
            let user = users.find(u => u.role === "Student" && u.srn === identifier && u.password === password);
            // Fallback for demo emails if they used email instead of srn
            if (!user) {
                user = users.find(u => u.role === "Student" && u.email === identifier && u.password === password);
            }
            return { user: user || null };
        }

        // For parents, identifier is Email
        if (role === "parent") {
            const user = users.find(u => u.role === "Parent" && u.email === identifier && u.password === password);
            return { user: user || null };
        }

        // For others
        const user = users.find(u => u.role.toLowerCase() === role && u.email === identifier && u.password === password);
        return { user: user || null };
    },

    getStudentBySRN: (srn: string): User | undefined => {
        const users = dataManager.getUsers();
        return users.find(u => u.role === "Student" && u.srn === srn);
    },

    findUserByEmail: (email: string, role: string): User | undefined => {
        const users = dataManager.getUsers();
        // Simple case-insensitive match for email + Role check
        return users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role.toLowerCase() === role.toLowerCase());
    },

    // Password Reset Requests (For Students -> Admin)
    addPasswordRequest: (request: { name?: string; email?: string; srn?: string; description: string; role: string }) => {
        const REQUESTS_KEY = "educare_requests_v1";
        const stored = localStorage.getItem(REQUESTS_KEY);
        const requests = stored ? JSON.parse(stored) : [];

        const newRequest = {
            id: Date.now(),
            ...request,
            date: new Date().toLocaleDateString(),
            status: "Pending"
        };

        localStorage.setItem(REQUESTS_KEY, JSON.stringify([...requests, newRequest]));
    },

    getPasswordRequests: () => {
        const REQUESTS_KEY = "educare_requests_v1";
        const stored = localStorage.getItem(REQUESTS_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    // --- EVENTS MANAGEMENT ---
    getEvents: (): Event[] => {
        const EVENTS_KEY = "educare_events_v1";
        const stored = localStorage.getItem(EVENTS_KEY);
        if (!stored) {
            localStorage.setItem(EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
            return INITIAL_EVENTS;
        }
        return JSON.parse(stored);
    },

    addEvent: (event: Omit<Event, "id" | "registeredStudents">) => {
        const EVENTS_KEY = "educare_events_v1";
        const events = dataManager.getEvents();
        const newEvent: Event = {
            id: Date.now(),
            ...event,
            registeredStudents: []
        };
        localStorage.setItem(EVENTS_KEY, JSON.stringify([...events, newEvent]));
        return newEvent;
    },

    updateEvent: (updatedEvent: Event) => {
        const EVENTS_KEY = "educare_events_v1";
        const events = dataManager.getEvents();
        const index = events.findIndex(e => e.id === updatedEvent.id);
        if (index !== -1) {
            events[index] = updatedEvent;
            localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
        }
    },

    deleteEvent: (eventId: number) => {
        const EVENTS_KEY = "educare_events_v1";
        const events = dataManager.getEvents().filter(e => e.id !== eventId);
        localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    },

    registerForEvent: (eventId: number, studentSrn: string) => {
        const EVENTS_KEY = "educare_events_v1";
        const events = dataManager.getEvents();
        const eventIndex = events.findIndex(e => e.id === eventId);

        if (eventIndex !== -1) {
            const event = events[eventIndex];
            if (!event.registeredStudents) event.registeredStudents = [];

            // Prevent duplicate registration
            if (!event.registeredStudents.includes(studentSrn)) {
                event.registeredStudents.push(studentSrn);
                events[eventIndex] = event;
                localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
                return true;
            }
        }
        return false;
    },

    unregisterFromEvent: (eventId: number, studentSrn: string) => {
        const EVENTS_KEY = "educare_events_v1";
        const events = dataManager.getEvents();
        const eventIndex = events.findIndex(e => e.id === eventId);

        if (eventIndex !== -1) {
            const event = events[eventIndex];
            if (event.registeredStudents) {
                event.registeredStudents = event.registeredStudents.filter(srn => srn !== studentSrn);
                events[eventIndex] = event;
                localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
                return true;
            }
        }
        return false;
    },

    // --- NOTIFICATIONS (Mocked based on Events) ---
    getParentNotifications: (linkedSrn: string) => {
        const events = dataManager.getEvents();
        const notifications: any[] = [];

        // Check for event registrations
        events.forEach(event => {
            if (event.registeredStudents?.includes(linkedSrn)) {
                notifications.push({
                    id: `evt-${event.id}`,
                    type: "event",
                    title: "Event Registration",
                    message: `Your child has registered for ${event.title} (${event.date}).`,
                    time: "Just now",
                    isRead: false
                });
            }
        });

        return notifications;
    },

    // --- SYSTEM UTILITIES ---
    exportData: () => {
        return {
            users: dataManager.getUsers(),
            events: dataManager.getEvents(),
            requests: dataManager.getPasswordRequests()
        };
    },

    importData: (data: any) => {
        if (data.users) localStorage.setItem("educare_users_v1", JSON.stringify(data.users));
        if (data.events) localStorage.setItem("educare_events_v1", JSON.stringify(data.events));
        if (data.requests) localStorage.setItem("educare_requests_v1", JSON.stringify(data.requests));
    },

    resetData: () => {
        localStorage.removeItem("educare_users_v1");
        localStorage.removeItem("educare_events_v1");
        localStorage.removeItem("educare_requests_v1");
        location.reload(); // Force reload to re-initialize from constants
    }
};

export interface Event {
    id: number;
    title: string;
    date: string;       // Display date e.g., "Jan 15, 2025" or ISO
    type: "Sports" | "Academic" | "Cultural" | "Meeting" | "Other";
    description: string;
    link?: string;      // Registration or Info Link
    registeredStudents: string[]; // List of SRNs
}

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
    }
];
