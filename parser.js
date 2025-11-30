const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, 'chats'); // Scan the 'chats' folder in the current directory
const outputFile = 'data.js';

// --- Configuration ---

const categories = {
    'Opportunities': {
        'Internships': ['internship', 'intern', 'stipend', 'trainee'],
        'Full-time Jobs': ['full-time', 'full time', 'hiring', 'vacancy', 'job opening', 'salary', 'ctc', 'engineer', 'developer', 'manager'],
        'Freelancing': ['freelance', 'freelancer', 'contract', 'gig', 'project basis'],
        'Volunteers': ['volunteer', 'volunteering', 'community service'],
        'Fellowships': ['fellowship', 'fellow'],
        'Programs / Cohorts': ['cohort', 'program', 'accelerator program', 'incubation program']
    },
    'Events': {
        'Hackathons': ['hackathon', 'hack', 'coding competition', 'build-a-thon'],
        'Meetups': ['meetup', 'meet-up', 'gathering', 'networking'],
        'Workshops': ['workshop', 'masterclass', 'training session', 'bootcamp'],
        'Webinars / Online Events': ['webinar', 'online session', 'zoom', 'google meet', 'live stream'],
        'Summits / Conferences': ['summit', 'conference', 'conclave', 'symposium'],
        'Startup Pitches / Demo Days': ['demo day', 'pitch', 'pitching', 'investor connect']
    },
    'Funding': {
        'Startup Grants': ['grant', 'equity-free', 'non-dilutive'],
        'Govt Schemes': ['scheme', 'government', 'subsidy', 'msme', 'startup india'],
        'Pitch Competitions': ['pitch competition', 'prize money', 'cash prize'],
        'Scholarships': ['scholarship', 'financial aid'],
        'Innovation Challenges': ['challenge', 'innovation contest', 'grand challenge']
    },
    'Academic / Exams': {
        'Competitions': ['competition', 'contest', 'quiz'],
        'Scholarships (student)': ['student scholarship', 'merit'],
        'Paper Calls / Journals': ['call for papers', 'journal', 'research paper', 'publication'],
        'Bootcamps': ['bootcamp', 'summer school']
    },
    'Resources': {
        'Courses': ['course', 'certification', 'learning', 'tutorial'],
        'Tools': ['tool', 'software', 'platform', 'app'],
        'Templates': ['template', 'checklist', 'framework'],
        'Announcements': ['announcement', 'update', 'news', 'launch', 'alert'],
        'Important Links': ['link', 'resource', 'guide']
    }
};

const smartTags = {
    modes: {
        'Online': ['online', 'zoom', 'virtual', 'webinar', 'teams', 'meet'],
        'Offline': ['venue', 'location', 'physical', 'campus', 'hotel', 'hall'],
        'Hybrid': ['hybrid', 'both online and offline']
    },
    costs: {
        'Free': ['free', 'no cost', 'complimentary', 'free entry'],
        'Paid': ['fee', 'ticket', 'price', 'cost', 'rs.', 'inr', '$', 'paid']
    },
    audiences: {
        'Students': ['student', 'fresher', 'graduate', 'college'],
        'Founders': ['founder', 'entrepreneur', 'startup owner', 'ceo'],
        'Developers': ['developer', 'coder', 'programmer', 'engineer']
    },
    urgency: ['deadline', 'last date', 'apply by', 'register by', 'closing soon', 'hurry']
};

const ignorePhrases = [
    'good morning', 'good afternoon', 'good evening', 'good night',
    'thank you', 'thanks', 'welcome',
    'congrats', 'congratulations',
    'happy birthday', 'happy anniversary',
    'lol', 'lmao', 'rofl', 'haha',
    'forwarded', 'forward please',
    'any updates', 'how are you',
    'this message was deleted', 'media omitted',
    'joined using a group link', 'added', 'removed', 'left'
];

// --- Helper Functions ---

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.txt')) {
                arrayOfFiles.push(path.join(dirPath, file));
            }
        }
    });

    return arrayOfFiles;
}

function classifyMessage(content) {
    const lowerContent = content.toLowerCase();
    let bestMatch = { category: 'Uncategorized', subCategory: 'General', score: 0 };

    for (const [cat, subCats] of Object.entries(categories)) {
        for (const [subCat, keywords] of Object.entries(subCats)) {
            let score = 0;
            keywords.forEach(k => {
                if (lowerContent.includes(k)) score += 1;
            });

            if (score > bestMatch.score) {
                bestMatch = { category: cat, subCategory: subCat, score: score };
            }
        }
    }

    return bestMatch;
}

function getSmartTags(content) {
    const lowerContent = content.toLowerCase();
    const tags = {
        mode: 'Unknown',
        cost: 'Unknown',
        audience: [],
        urgency: false,
        region: 'Unknown',
        phoneNumber: null
    };

    // Mode
    if (smartTags.modes['Hybrid'].some(k => lowerContent.includes(k))) tags.mode = 'Hybrid';
    else if (smartTags.modes['Online'].some(k => lowerContent.includes(k))) tags.mode = 'Online';
    else if (smartTags.modes['Offline'].some(k => lowerContent.includes(k))) tags.mode = 'Offline';

    // Cost
    if (smartTags.costs['Free'].some(k => lowerContent.includes(k))) tags.cost = 'Free';
    else if (smartTags.costs['Paid'].some(k => lowerContent.includes(k))) tags.cost = 'Paid';

    // Audience
    for (const [aud, keywords] of Object.entries(smartTags.audiences)) {
        if (keywords.some(k => lowerContent.includes(k))) tags.audience.push(aud);
    }

    // Urgency
    if (smartTags.urgency.some(k => lowerContent.includes(k))) tags.urgency = true;

    // Region
    const regions = ['visakhapatnam', 'vizag', 'hyderabad', 'bangalore', 'bengaluru', 'delhi', 'ncr', 'mumbai', 'pune', 'chennai', 'remote'];
    for (const region of regions) {
        if (lowerContent.includes(region)) {
            tags.region = region.charAt(0).toUpperCase() + region.slice(1);
            break;
        }
    }

    // Phone Number Extraction
    // Matches: +91 9876543210, 98765 43210, 9876543210
    const phoneRegex = /(?:\+91[\-\s]?)?[6-9]\d{4}[\-\s]?\d{5}/g;
    const phones = content.match(phoneRegex);
    if (phones && phones.length > 0) {
        tags.phoneNumber = phones[0].replace(/\s/g, '').replace(/-/g, '');
    }

    return tags;
}

function isNotUseful(content) {
    const lowerContent = content.toLowerCase().trim();

    if (lowerContent.length < 5) return true; // Too short
    if (ignorePhrases.some(phrase => lowerContent.includes(phrase))) return true;

    return false;
}

// --- Main Logic ---

const allFiles = getAllFiles(rootDir);
console.log(`Found ${allFiles.length} text files.`);

let allMessages = [];
const dateRegex = /^(\d{2}\/\d{2}\/\d{4}), (\d{2}:\d{2}) - /;

allFiles.forEach(filePath => {
    console.log(`Processing: ${path.basename(filePath)}`);
    let groupName = path.basename(path.dirname(filePath)); // Use parent folder as group name
    if (groupName === 'chats') {
        groupName = path.basename(filePath, '.txt');
    }
    const rawData = fs.readFileSync(filePath, 'utf8');
    const lines = rawData.split('\n');

    let currentMessage = null;

    lines.forEach(line => {
        line = line.replace(/[\u200e\u200f]/g, "").trim();
        const match = line.match(dateRegex);

        if (match) {
            if (currentMessage) {
                // Process previous message
                if (!isNotUseful(currentMessage.content)) {
                    const classification = classifyMessage(currentMessage.content);
                    const tags = getSmartTags(currentMessage.content);

                    let confidence = 'Low';
                    if (classification.score >= 2) confidence = 'High';
                    else if (classification.score === 1) confidence = 'Medium';

                    if (classification.score === 0 && currentMessage.content.length < 50 && !currentMessage.content.includes('http')) {
                        classification.category = 'Not Useful';
                    }

                    currentMessage.category = classification.category;
                    currentMessage.subCategory = classification.subCategory;
                    currentMessage.meta = tags;
                    currentMessage.confidence = confidence;

                    allMessages.push(currentMessage);
                }
            }

            const fullDate = match[0];
            const contentPart = line.substring(fullDate.length);
            const separatorIndex = contentPart.indexOf(': ');

            let sender = 'System';
            let content = contentPart;

            if (separatorIndex !== -1) {
                sender = contentPart.substring(0, separatorIndex);
                content = contentPart.substring(separatorIndex + 2);
            }

            currentMessage = {
                id: Math.random().toString(36).substr(2, 9),
                group: groupName,
                date: match[1],
                time: match[2],
                sender: sender,
                content: content
            };
        } else {
            if (currentMessage) {
                currentMessage.content += '\n' + line;
            }
        }
    });

    // Push last message
    if (currentMessage && !isNotUseful(currentMessage.content)) {
        const classification = classifyMessage(currentMessage.content);
        const tags = getSmartTags(currentMessage.content);
        let confidence = 'Low';
        if (classification.score >= 2) confidence = 'High';
        else if (classification.score === 1) confidence = 'Medium';

        if (classification.score === 0 && currentMessage.content.length < 50 && !currentMessage.content.includes('http')) {
            classification.category = 'Not Useful';
        }

        currentMessage.category = classification.category;
        currentMessage.subCategory = classification.subCategory;
        currentMessage.meta = tags;
        currentMessage.confidence = confidence;
        allMessages.push(currentMessage);
    }
});

// Sort by date (descending)
allMessages.sort((a, b) => {
    const [d1, m1, y1] = a.date.split('/');
    const [d2, m2, y2] = b.date.split('/');
    const dateA = new Date(`${y1}-${m1}-${d1}T${a.time}`);
    const dateB = new Date(`${y2}-${m2}-${d2}T${b.time}`);
    return dateB - dateA;
});

const jsContent = `window.whatsappGodData = ${JSON.stringify(allMessages, null, 2)};`;
fs.writeFileSync(path.join(__dirname, outputFile), jsContent);
console.log(`Processed ${allFiles.length} files. Extracted ${allMessages.length} messages.`);
