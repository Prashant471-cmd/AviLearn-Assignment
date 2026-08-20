<%@ Page Title="Home" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="AviLearn.Web.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        .hero {
            background: linear-gradient(135deg, #F7F5F0 0%, #E5E2D9 100%);
            padding: 6rem 0;
            text-align: center;
        }
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            color: #121212;
        }
        .hero p {
            font-size: 1.25rem;
            color: #4A4A4A;
            max-width: 600px;
            margin: 0 auto 2rem;
            font-style: italic;
            font-family: 'Newsreader', serif;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 4rem;
        }
        .feature-card {
            text-align: left;
        }
        .feature-icon {
            width: 48px;
            height: 48px;
            background-color: #3D4435;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }
    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <section class="hero">
        <div class="container">
            <h1>Discover the Science of <span style="color: #6B9F5E; font-style: italic;">Ornithology</span></h1>
            <p>
                AviLearn bridges the gap between amateur bird watching and professional ornithological studies. Explore our interactive directory, test your knowledge, and build your life list.
            </p>
            <div>
                <% if (Session["UserRole"] == null) { %>
                    <a href="Register.aspx" class="btn btn-primary" style="margin-right: 1rem;">Start Learning Free</a>
                <% } else { %>
                    <a href="Dashboard.aspx" class="btn btn-primary" style="margin-right: 1rem;">Go to Dashboard</a>
                <% } %>
                <a href="BirdDirectory.aspx" class="btn btn-ghost">Browse Directory</a>
            </div>
        </div>
    </section>

    <section class="section container">
        <div style="text-align: center; margin-bottom: 3rem;">
            <p style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #8C867A; margin-bottom: 0.5rem;">Interactive Learning</p>
            <h2>Everything you need to master birding</h2>
        </div>

        <div class="feature-grid">
            <div class="card feature-card">
                <div class="feature-icon">🦅</div>
                <h3>Extensive Species Directory</h3>
                <p style="margin-top: 0.5rem; color: #4A4A4A; font-size: 0.9rem;">
                    Search and filter through documented species. Includes taxonomy, conservation status, diet, habitat, and detailed field marks.
                </p>
            </div>
            
            <div class="card feature-card">
                <div class="feature-icon">🎧</div>
                <h3>Acoustic Synthesizer</h3>
                <p style="margin-top: 0.5rem; color: #4A4A4A; font-size: 0.9rem;">
                    Listen to synthesized bird calls and songs to train your ear for field identification. Powered by Web Audio API.
                </p>
            </div>
            
            <div class="card feature-card">
                <div class="feature-icon">🎓</div>
                <h3>Interactive Quizzes</h3>
                <p style="margin-top: 0.5rem; color: #4A4A4A; font-size: 0.9rem;">
                    Test your knowledge with multiple-choice quizzes ranging from beginner to expert difficulty. Earn XP and level up.
                </p>
            </div>
        </div>
    </section>
</asp:Content>
