-- AviLearn SQL Server Database Schema (T-SQL)
-- Simplified for SmarterASP.NET Web SQL Manager

CREATE TABLE Users (
    Id VARCHAR(50) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL DEFAULT 'member',
    JoinDate DATETIME NOT NULL DEFAULT GETDATE(),
    XP INT NOT NULL DEFAULT 0
);

CREATE TABLE BirdSpecies (
    Id VARCHAR(50) PRIMARY KEY,
    CommonName NVARCHAR(100) NOT NULL,
    ScientificName NVARCHAR(150) NOT NULL,
    TaxonomicOrder NVARCHAR(50) NOT NULL,
    Family NVARCHAR(50) NOT NULL,
    Genus NVARCHAR(50),
    Description NVARCHAR(MAX) NOT NULL,
    ConservationStatus NVARCHAR(5) NOT NULL,
    StatusLabel NVARCHAR(50) NOT NULL,
    RarityLevel NVARCHAR(20) NOT NULL,
    MigrationStatus NVARCHAR(50) NOT NULL,
    ImageUrl NVARCHAR(255),
    AudioUrl NVARCHAR(255),
    CallDescription NVARCHAR(MAX),
    FunFact NVARCHAR(MAX),
    Nesting NVARCHAR(MAX),
    Habitat NVARCHAR(MAX), 
    Diet NVARCHAR(MAX),
    Region NVARCHAR(MAX),
    KeyFieldMarks NVARCHAR(MAX),
    AudioFrequencyHz INT,
    AudioPattern NVARCHAR(50)
);

CREATE TABLE QuizSets (
    Id VARCHAR(50) PRIMARY KEY,
    Title NVARCHAR(150) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Category NVARCHAR(100) NOT NULL,
    Difficulty NVARCHAR(20) NOT NULL
);

CREATE TABLE QuizQuestions (
    Id VARCHAR(50) PRIMARY KEY,
    QuizSetId VARCHAR(50) NOT NULL,
    QuestionType NVARCHAR(20) NOT NULL,
    QuestionText NVARCHAR(MAX) NOT NULL,
    Options NVARCHAR(MAX) NOT NULL, 
    CorrectIndex INT NOT NULL,
    Explanation NVARCHAR(MAX),
    FieldMarkHint NVARCHAR(MAX),
    ImageUrl NVARCHAR(255),
    AudioFrequencyHz INT,
    AudioPattern NVARCHAR(50),
    FOREIGN KEY (QuizSetId) REFERENCES QuizSets(Id) ON DELETE CASCADE
);

CREATE TABLE QuizResults (
    Id VARCHAR(50) PRIMARY KEY,
    UserId VARCHAR(50) NOT NULL,
    QuizSetId VARCHAR(50) NOT NULL,
    Score INT NOT NULL,
    Total INT NOT NULL,
    Percentage INT NOT NULL,
    AttemptDate DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (QuizSetId) REFERENCES QuizSets(Id) ON DELETE CASCADE
);

INSERT INTO Users (Id, Name, Email, PasswordHash, Role, XP) VALUES 
('usr_admin_1', 'Admin User', 'admin@avilearn.com', 'Admin123!', 'admin', 0);

INSERT INTO Users (Id, Name, Email, PasswordHash, Role, XP) VALUES 
('usr_member_1', 'Demo Member', 'member@avilearn.com', 'Member123!', 'member', 150);

INSERT INTO BirdSpecies (Id, CommonName, ScientificName, TaxonomicOrder, Family, Genus, Description, ConservationStatus, StatusLabel, RarityLevel, MigrationStatus, ImageUrl, AudioUrl, Habitat, Diet, Region, KeyFieldMarks, AudioFrequencyHz, AudioPattern) VALUES
('bird_1', 'Northern Cardinal', 'Cardinalis cardinalis', 'Passeriformes', 'Cardinalidae', 'Cardinalis', 'The northern cardinal is a species of passerine bird in the family Cardinalidae. It is also known colloquially as the redbird, common cardinal, red cardinal, or just cardinal.', 'LC', 'Least Concern', 'Common', 'Resident', 'https://images.unsplash.com/photo-1549608276-5786777e6587', NULL, '["Woodlands", "Gardens"]', '["Seeds", "Insects", "Berries"]', '["North America"]', '["Bright red body (males)", "Prominent crest", "Thick orange bill"]', 1200, 'whistle-slide');

