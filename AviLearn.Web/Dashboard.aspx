<%@ Page Title="Member Dashboard" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="Dashboard.aspx.cs" Inherits="AviLearn.Web.Dashboard" %>

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
        .container, .dashboard-header, .dashboard-grid {
            position: relative;
            z-index: 10;
        }
        .dashboard-header {
            padding: 4rem 0 3rem 0;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            flex-wrap: wrap;
            gap: 2rem;
        }
        .welcome-group h1 {
            font-size: 4rem;
            margin-bottom: 0.5rem;
        }
        .welcome-group p {
            font-size: 1.2rem;
            color: var(--color-text-light);
            font-weight: 600;
        }
        .stats-group {
            display: flex;
            gap: 2rem;
        }
        .stat-box {
            background: #fff;
            border: 2px solid var(--color-border);
            padding: 1.5rem 2.5rem;
            border-radius: var(--radius-lg);
            border-bottom-left-radius: 8px; /* asymmetric */
            text-align: center;
            box-shadow: var(--shadow-sm);
            transition: all 0.2s;
        }
        .stat-box:hover {
            border-color: var(--color-accent);
            transform: translateY(-4px);
            box-shadow: var(--shadow-md);
        }
        .stat-value {
            font-size: 2.5rem;
            font-weight: 900;
            color: var(--color-text-primary);
            line-height: 1;
            margin-bottom: 0.5rem;
        }
        .stat-label {
            font-size: 0.9rem;
            font-weight: 800;
            color: var(--color-text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .dashboard-grid {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 3rem;
            margin-bottom: 4rem;
        }
        .quick-actions-card {
            background: var(--color-bg-canvas);
            border: 2px solid var(--color-border);
            border-radius: var(--radius-lg);
            padding: 2.5rem;
            box-shadow: var(--shadow-sm);
        }
        .quick-actions-card h3 {
            font-size: 1.1rem;
            font-weight: 900;
            color: var(--color-text-primary);
            margin-bottom: 1.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .quick-actions-card .btn {
            width: 100%;
            margin-bottom: 1rem;
            padding: 1rem 2rem;
        }
        .history-section h2 {
            font-size: 2.5rem;
            margin-bottom: 2rem;
        }
        .badge-green { background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0; }
        .badge-amber { background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; }
        .badge-red { background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; }
        .badge {
            padding: 0.4rem 1rem;
            border-radius: var(--radius-pill);
            font-weight: 800;
            font-size: 0.85rem;
            display: inline-block;
        }
        @media (max-width: 900px) {
            .dashboard-grid { grid-template-columns: 1fr; }
            .dashboard-header { flex-direction: column; align-items: flex-start; }
            .welcome-group h1 { font-size: 3rem; }
        }
    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="container page-transition">
        
        <div class="dashboard-header">
            <div class="welcome-group">
                <p style="color: var(--color-accent); font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">Member Dashboard</p>
                <h1>Welcome, <asp:Literal ID="litUserName" runat="server"></asp:Literal></h1>
                <p>
                    Level <asp:Literal ID="litLevel" runat="server">1</asp:Literal> Birder &middot; <asp:Literal ID="litXP" runat="server">0</asp:Literal> XP earned
                </p>
            </div>
            
            <div class="stats-group">
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
                <div class="quick-actions-card">
                    <h3>Quick Actions</h3>
                    
                    <a href="Quiz.aspx" class="btn btn-primary">Take a Quiz</a>
                    <a href="BirdDirectory.aspx" class="btn btn-ghost">Browse Birds</a>
                </div>
            </aside>

            <main class="history-section">
                <h2>Recent Quiz History</h2>
                
                <div class="card" style="padding: 0; overflow: hidden; border: 2px solid var(--color-border);">
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
