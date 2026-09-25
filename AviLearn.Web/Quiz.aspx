<%@ Page Title="Quizzes" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="Quiz.aspx.cs"
    Inherits="AviLearn.Web.Quiz" %>

    <asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
        <style>
            body {
                position: relative;
            }
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('/images/dashboard_bg_circles.png');
                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
                opacity: 0.3;
                z-index: 0;
                pointer-events: none;
            }
            .quiz-container {
                position: relative;
                z-index: 10;
                max-width: 1200px;
                margin: 0 auto;
                padding: 4rem 5%;
            }

            .quiz-header {
                text-align: center;
                margin-bottom: 4rem;
            }

            .quiz-header h1 {
                font-size: 4rem;
                margin-bottom: 1rem;
            }

            .quiz-header p {
                font-size: 1.2rem;
                color: var(--color-text-light);
                font-weight: 600;
            }

            .questions-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 2.5rem;
                margin-bottom: 3rem;
            }

            .question-card {
                background: white;
                padding: 2.5rem;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                transition: all 0.2s;
            }

            .question-card:hover {
                border-color: var(--color-accent);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }

            .question-card h3 {
                font-size: 1.4rem;
                margin-bottom: 2rem;
                color: #0f172a;
                line-height: 1.5;
                font-weight: 900;
            }

            /* 2x2 Grid for Options using UnorderedList */
            .options-list {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.25rem;
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .options-list li {
                display: flex;
                align-items: center;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 1rem 1.5rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .options-list li:hover {
                background: white;
                border-color: var(--color-accent);
                box-shadow: 0 4px 12px rgba(251, 191, 36, 0.15);
                transform: translateY(-2px);
            }

            .options-list input[type="radio"] {
                margin-right: 1rem;
                transform: scale(1.3);
                accent-color: var(--color-accent);
                cursor: pointer;
            }

            .options-list label {
                font-weight: 600;
                font-size: 1rem;
                color: #1e293b;
                cursor: pointer;
                width: 100%;
            }

            @media (max-width: 992px) {
                .questions-grid {
                    grid-template-columns: 1fr;
                }
            }

            @media (max-width: 768px) {
                .options-list {
                    grid-template-columns: 1fr;
                }
            }

            .result-box {
                background-color: #E0F2FE;
                padding: 4rem 2rem;
                text-align: center;
                border-radius: var(--radius-lg);
                margin-top: 2rem;
                border-bottom-left-radius: 8px;
                /* asymmetric */
            }

            .result-box h2 {
                font-size: 2.5rem;
                margin-bottom: 1.5rem;
                color: var(--color-text-primary);
            }

            .score-display {
                font-size: 6rem;
                font-weight: 900;
                color: var(--color-nav-active);
                margin-bottom: 1rem;
                line-height: 1;
            }

            .xp-display {
                font-size: 1.3rem;
                color: var(--color-text-primary);
                font-weight: 700;
                margin-bottom: 2.5rem;
            }
        </style>
    </asp:Content>

    <asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
        <div class="container quiz-container page-transition">
            <div class="quiz-header">
                <h1>Field Identification Quiz</h1>
                <p>Test your knowledge of North American bird species.</p>
            </div>

            <asp:Panel ID="pnlQuiz" runat="server">
                <div class="questions-grid">
                    <div class="question-card">
                        <h3>1. Which of these species is known for its bright red plumage and prominent crest?</h3>

                        <asp:RadioButtonList ID="rblQ1" runat="server" CssClass="options-list"
                            RepeatLayout="UnorderedList">
                            <asp:ListItem Text="Blue Jay (Cyanocitta cristata)" Value="0" />
                            <asp:ListItem Text="Northern Cardinal (Cardinalis cardinalis)" Value="1" />
                            <asp:ListItem Text="American Robin (Turdus migratorius)" Value="0" />
                            <asp:ListItem Text="House Finch (Haemorhous mexicanus)" Value="0" />
                        </asp:RadioButtonList>
                    </div>

                    <div class="question-card">
                        <h3>2. What is the conservation status of the Northern Cardinal?</h3>

                        <asp:RadioButtonList ID="rblQ2" runat="server" CssClass="options-list"
                            RepeatLayout="UnorderedList">
                            <asp:ListItem Text="Endangered (EN)" Value="0" />
                            <asp:ListItem Text="Near Threatened (NT)" Value="0" />
                            <asp:ListItem Text="Least Concern (LC)" Value="1" />
                            <asp:ListItem Text="Vulnerable (VU)" Value="0" />
                        </asp:RadioButtonList>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 3rem;">
                    <asp:Button ID="btnSubmitQuiz" runat="server" Text="Submit Answers" CssClass="btn btn-primary"
                        OnClick="btnSubmitQuiz_Click" style="padding: 1rem 4rem; font-size: 1.2rem;" />
                </div>
            </asp:Panel>

            <asp:Panel ID="pnlResult" runat="server" Visible="false">
                <div class="result-box">
                    <h2>Quiz Completed!</h2>
                    <div class="score-display">
                        <asp:Literal ID="litScore" runat="server"></asp:Literal> / 2
                    </div>
                    <p class="xp-display">
                        You earned <asp:Literal ID="litXPEarned" runat="server"></asp:Literal> XP!
                    </p>
                    <a href="Dashboard.aspx" class="btn btn-primary"
                        style="padding: 1rem 3rem; font-size: 1.1rem;">Return to Dashboard</a>
                </div>
            </asp:Panel>
        </div>
    </asp:Content>