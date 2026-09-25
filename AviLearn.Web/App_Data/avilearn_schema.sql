-- AviLearn SQL Server Database Schema (T-SQL)
-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'avilearn')
BEGIN
    CREATE DATABASE avilearn;
END
GO

USE avilearn;
GO

-- Users Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' and xtype='U')
BEGIN
    CREATE TABLE Users (
        Id VARCHAR(50) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        Role NVARCHAR(20) NOT NULL DEFAULT 'member', -- 'member' or 'admin'
        JoinDate DATETIME NOT NULL DEFAULT GETDATE(),
        XP INT NOT NULL DEFAULT 0
    );
END
GO
Select * From BirdSpecies;
-- Bird Species Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='BirdSpecies' and xtype='U')
BEGIN
    CREATE TABLE BirdSpecies (
        Id VARCHAR(50) PRIMARY KEY,
        CommonName NVARCHAR(100) NOT NULL,
        ScientificName NVARCHAR(150) NOT NULL,
        TaxonomicOrder NVARCHAR(50) NOT NULL,
        Family NVARCHAR(50) NOT NULL,
        Genus NVARCHAR(50),
        Description NVARCHAR(MAX) NOT NULL,
        ConservationStatus NVARCHAR(5) NOT NULL, -- LC, NT, VU, EN, CR
        StatusLabel NVARCHAR(50) NOT NULL,
        RarityLevel NVARCHAR(20) NOT NULL, -- Common, Uncommon, Rare, Vagrant
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
END
GO

-- Quiz Sets Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='QuizSets' and xtype='U')
BEGIN
    CREATE TABLE QuizSets (
        Id VARCHAR(50) PRIMARY KEY,
        Title NVARCHAR(150) NOT NULL,
        Description NVARCHAR(MAX) NOT NULL,
        Category NVARCHAR(100) NOT NULL,
        Difficulty NVARCHAR(20) NOT NULL -- Beginner, Intermediate, Expert
    );
END
GO

-- Quiz Questions Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='QuizQuestions' and xtype='U')
BEGIN
    CREATE TABLE QuizQuestions (
        Id VARCHAR(50) PRIMARY KEY,
        QuizSetId VARCHAR(50) NOT NULL,
        QuestionType NVARCHAR(20) NOT NULL, -- multiple-choice, audio, image
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
END
GO

-- Quiz Results Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='QuizResults' and xtype='U')
BEGIN
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
END
GO

-- Insert Default Admin and Member if they don't exist
IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'admin@avilearn.com')
BEGIN
    INSERT INTO Users (Id, Name, Email, PasswordHash, Role, XP) VALUES 
    ('usr_admin_1', 'Admin User', 'admin@avilearn.com', 'Admin123!', 'admin', 0);
END
GO

IF NOT EXISTS (SELECT * FROM Users WHERE Email = 'member@avilearn.com')
BEGIN
    INSERT INTO Users (Id, Name, Email, PasswordHash, Role, XP) VALUES 
    ('usr_member_1', 'Demo Member', 'member@avilearn.com', 'Member123!', 'member', 150);
END
GO

-- Insert Sample Bird if it doesn't exist
IF NOT EXISTS (SELECT * FROM BirdSpecies WHERE Id = 'bird_1')
BEGIN
    INSERT INTO BirdSpecies (Id, CommonName, ScientificName, TaxonomicOrder, Family, Genus, Description, ConservationStatus, StatusLabel, RarityLevel, MigrationStatus, ImageUrl, AudioUrl, Habitat, Diet, Region, KeyFieldMarks, AudioFrequencyHz, AudioPattern) VALUES
    ('bird_1', 'Northern Cardinal', 'Cardinalis cardinalis', 'Passeriformes', 'Cardinalidae', 'Cardinalis', 'The northern cardinal is a species of passerine bird in the family Cardinalidae. It is also known colloquially as the redbird, common cardinal, red cardinal, or just cardinal.', 'LC', 'Least Concern', 'Common', 'Resident', 'https://images.unsplash.com/photo-1549608276-5786777e6587', NULL, '["Woodlands", "Gardens"]', '["Seeds", "Insects", "Berries"]', '["North America"]', '["Bright red body (males)", "Prominent crest", "Thick orange bill"]', 1200, 'whistle-slide');
END
GO
