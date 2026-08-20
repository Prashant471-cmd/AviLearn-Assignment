<%@ Page Title="Quizzes" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="Quiz.aspx.cs" Inherits="AviLearn.Web.Quiz" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        .quiz-container {
            max-width: 800px;
            margin: 0 auto;
        }
        .question-card {
            background-color: white;
            padding: 2rem;
            border-radius: var(--radius-lg);
            border: 1px solid var(--color-border);
            margin-bottom: 2rem;
        }
        .options-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        .option-label {
            display: flex;
            align-items: center;
            padding: 1rem;
            border: 1px solid var(--color-border-strong);
            border-radius: var(--radius-sm);
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .option-label:hover {
            border-color: var(--color-accent);
            background-color: var(--color-surface-alt);
        }
        .option-input {
            margin-right: 1rem;
        }
        .quiz-header {
            text-align: center;
            margin-bottom: 3rem;
        }
        .result-box {
            background-color: var(--color-surface-alt);
            padding: 2rem;
            text-align: center;
            border-radius: var(--radius-md);
            margin-top: 2rem;
        }
    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="container section quiz-container">
        <div class="quiz-header">
            <h1 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 0.5rem;">Field Identification Quiz</h1>
            <p style="color: var(--color-text-muted);">Test your knowledge of North American bird species.</p>
        </div>

        <asp:Panel ID="pnlQuiz" runat="server">
            <div class="question-card">
                <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">1. Which of these species is known for its bright red plumage and prominent crest?</h3>
                
                <asp:RadioButtonList ID="rblQ1" runat="server" CssClass="options-list" RepeatLayout="Flow">
                    <asp:ListItem Text="Blue Jay (Cyanocitta cristata)" Value="0" />
                    <asp:ListItem Text="Northern Cardinal (Cardinalis cardinalis)" Value="1" />
                    <asp:ListItem Text="American Robin (Turdus migratorius)" Value="0" />
                    <asp:ListItem Text="House Finch (Haemorhous mexicanus)" Value="0" />
                </asp:RadioButtonList>
            </div>

            <div class="question-card">
                <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">2. What is the conservation status of the Northern Cardinal?</h3>
                
                <asp:RadioButtonList ID="rblQ2" runat="server" CssClass="options-list" RepeatLayout="Flow">
                    <asp:ListItem Text="Endangered (EN)" Value="0" />
                    <asp:ListItem Text="Near Threatened (NT)" Value="0" />
                    <asp:ListItem Text="Least Concern (LC)" Value="1" />
                    <asp:ListItem Text="Vulnerable (VU)" Value="0" />
                </asp:RadioButtonList>
            </div>

            <div style="text-align: center; margin-top: 2rem;">
                <asp:Button ID="btnSubmitQuiz" runat="server" Text="Submit Answers" CssClass="btn btn-primary" OnClick="btnSubmitQuiz_Click" />
            </div>
        </asp:Panel>

        <asp:Panel ID="pnlResult" runat="server" Visible="false">
            <div class="result-box card">
                <h2 style="margin-bottom: 1rem;">Quiz Completed!</h2>
                <div style="font-size: 3rem; font-weight: 900; color: var(--color-accent); font-family: 'Playfair Display', serif; margin-bottom: 1rem;">
                    <asp:Literal ID="litScore" runat="server"></asp:Literal> / 2
                </div>
                <p style="margin-bottom: 2rem; color: var(--color-text-muted);">
                    You earned <asp:Literal ID="litXPEarned" runat="server"></asp:Literal> XP!
                </p>
                <a href="Dashboard.aspx" class="btn btn-primary">Return to Dashboard</a>
            </div>
        </asp:Panel>
    </div>
</asp:Content>
