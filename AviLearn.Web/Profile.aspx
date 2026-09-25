<%@ Page Title="My Profile" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="Profile.aspx.cs" Inherits="AviLearn.Web.Profile" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        .profile-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 70vh;
            padding: 2rem;
            position: relative;
        }

        .profile-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
            padding: 3rem;
            width: 100%;
            max-width: 500px;
            text-align: center;
            position: relative;
            overflow: hidden;
            transform: translateY(20px);
            animation: floatUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes floatUp {
            to { transform: translateY(0); opacity: 1; }
        }

        .profile-avatar {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, var(--accent), var(--accent-light));
            border-radius: 50%;
            margin: 0 auto 1.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 3rem;
            font-weight: 800;
            box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);
            border: 4px solid white;
        }

        .profile-name {
            font-size: 2rem;
            font-weight: 800;
            color: var(--text-dark);
            margin-bottom: 0.5rem;
        }

        .profile-role {
            display: inline-block;
            background: var(--primary-light);
            color: var(--primary);
            padding: 0.25rem 1rem;
            border-radius: 20px;
            font-weight: 700;
            font-size: 0.9rem;
            margin-bottom: 1.5rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .profile-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 2px dashed rgba(0,0,0,0.1);
        }

        .stat-box {
            background: white;
            border-radius: 16px;
            padding: 1.5rem 1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
            transition: transform 0.3s ease;
        }

        .stat-box:hover {
            transform: translateY(-5px);
        }

        .stat-value {
            font-size: 2rem;
            font-weight: 900;
            color: var(--accent);
            margin-bottom: 0.25rem;
        }

        .stat-label {
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--text-light);
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .profile-email {
            color: var(--text-light);
            font-weight: 600;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        /* Decorative background blobs */
        .blob-1 {
            position: absolute;
            top: -10%;
            left: -10%;
            width: 300px;
            height: 300px;
            background: var(--accent-light);
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.5;
            z-index: -1;
        }
        .blob-2 {
            position: absolute;
            bottom: -10%;
            right: -10%;
            width: 300px;
            height: 300px;
            background: var(--primary-light);
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.5;
            z-index: -1;
        }
    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="profile-container">
        <div class="blob-1"></div>
        <div class="blob-2"></div>
        
        <div class="profile-card">
            <div class="profile-avatar">
                <asp:Label ID="lblInitial" runat="server" Text="A"></asp:Label>
            </div>
            
            <h1 class="profile-name">
                <asp:Label ID="lblName" runat="server" Text="User Name"></asp:Label>
            </h1>
            
            <div class="profile-role">
                <asp:Label ID="lblRole" runat="server" Text="Member"></asp:Label>
            </div>

            <div class="profile-email">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <asp:Label ID="lblEmail" runat="server" Text="user@example.com"></asp:Label>
            </div>
            
            <div class="profile-stats">
                <div class="stat-box">
                    <div class="stat-value">
                        <asp:Label ID="lblXP" runat="server" Text="0"></asp:Label>
                    </div>
                    <div class="stat-label">Total XP</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value" style="color: var(--primary);">
                        <asp:Label ID="lblJoinYear" runat="server" Text="2026"></asp:Label>
                    </div>
                    <div class="stat-label">Joined</div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
