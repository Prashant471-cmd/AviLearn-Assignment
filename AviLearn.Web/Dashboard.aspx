<%@ Page Title="Member Dashboard" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="Dashboard.aspx.cs" Inherits="AviLearn.Web.Dashboard" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        .dashboard-header {
            background: linear-gradient(135deg, #3D4435 0%, #2d3f26 100%);
            border-radius: var(--radius-lg);
            padding: 2rem 2.5rem;
            margin-bottom: 2rem;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1.5rem;
        }
        .dashboard-header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 2.25rem;
            margin-bottom: 0.5rem;
            color: white;
        }
        .stat-box {
            text-align: center;
        }
        .stat-value {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            font-weight: 900;
        }
        .stat-label {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 0.6rem;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: rgba(255,255,255,0.7);
        }
        .dashboard-grid {
            display: grid;
            grid-template-columns: 260px 1fr;
            gap: 2rem;
        }
        @media (max-width: 900px) {
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="container section">
        
        <div class="dashboard-header">
            <div>
                <p style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.25em; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem;">Member Dashboard</p>
                <h1>Welcome back, <asp:Literal ID="litUserName" runat="server"></asp:Literal></h1>
                <p style="font-family: 'Newsreader', serif; font-style: italic; color: rgba(255,255,255,0.7); font-size: 1rem;">
                    Level <asp:Literal ID="litLevel" runat="server">1</asp:Literal> Birder &middot; <asp:Literal ID="litXP" runat="server">0</asp:Literal> XP earned
                </p>
            </div>
            
            <div style="display: flex; gap: 2rem;">
                <div class="stat-box">
                    <div class="stat-value"><asp:Literal ID="litQuizCount" runat="server">0</asp:Literal></div>
                    <div class="stat-label">Quizzes Taken</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value"><asp:Literal ID="litAvgScore" runat="server">0</asp:Literal>%</div>
                    <div class="stat-label">Avg Score</div>
                </div>
            </div>
        </div>

        <div class="dashboard-grid">
            <aside>
                <div class="card" style="margin-bottom: 1.5rem;">
                    <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-subtle); margin-bottom: 1rem;">Quick Actions</h3>
                    
                    <a href="Quiz.aspx" class="btn btn-primary btn-full" style="margin-bottom: 0.5rem;">Take a Quiz</a>
                    <a href="BirdDirectory.aspx" class="btn btn-ghost btn-full">Browse Birds</a>
                </div>
            </aside>

            <main>
                <h2 style="margin-bottom: 1.5rem;">Recent Quiz History</h2>
                
                <div class="card">
                    <asp:GridView ID="gvQuizHistory" runat="server" AutoGenerateColumns="False" 
                        CssClass="data-table" GridLines="None" EmptyDataText="No quiz results yet. Take a quiz to earn XP!">
                        <Columns>
                            <asp:BoundField DataField="QuizTitle" HeaderText="Quiz" />
                            <asp:BoundField DataField="AttemptDate" HeaderText="Date" DataFormatString="{0:MMM dd, yyyy}" />
                            <asp:BoundField DataField="ScoreDisplay" HeaderText="Score" />
                            <asp:TemplateField HeaderText="Result">
                                <ItemTemplate>
                                    <span class="badge <%# Convert.ToInt32(Eval("Percentage")) >= 80 ? "badge-green" : Convert.ToInt32(Eval("Percentage")) >= 60 ? "badge-amber" : "badge-red" %>">
                                        <%# Eval("Percentage") %>%
                                    </span>
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                    </asp:GridView>
                </div>
            </main>
        </div>

    </div>
</asp:Content>
