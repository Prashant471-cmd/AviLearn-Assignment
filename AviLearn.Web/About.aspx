<%@ Page Title="About AviLearn" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="About.aspx.cs" Inherits="AviLearn.Web.About" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        /* Wrapper for full content area */
        .about-page-wrapper {
            position: relative;
            min-height: calc(100vh - 80px); /* Fill the screen below header */
            width: 100%;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 0;
        }

        /* Absolute Background Video */
        .video-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
        }
        .video-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%);
        }

        /* Glassmorphism Content Card */
        .about-header {
            text-align: center;
            padding: 3rem 0 2rem 0;
            color: white;
        }
        .about-glass-card {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: var(--radius-xl);
            padding: 3rem;
            color: white;
            box-shadow: var(--shadow-2xl);
            position: relative;
            z-index: 10;
        }
        
        .about-content {
            font-size: 1.15rem;
            line-height: 1.8;
            color: rgba(255, 255, 255, 0.9);
            text-align: center;
        }
        .about-content p {
            margin-bottom: 1.5rem;
        }

        .tech-stack-card {
            margin-top: 3rem;
            background: rgba(255, 255, 255, 0.95);
            border-radius: var(--radius-lg);
            padding: 2rem;
            color: var(--color-text-primary);
            text-align: left;
        }
    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="about-page-wrapper">
        <!-- Background Video -->
        <video class="video-background" autoplay loop muted playsinline>
            <source src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Flying_Birds_1_2022-12-05.webm" type="video/webm">
        </video>
        <div class="video-overlay"></div>

        <div class="container" style="position: relative; z-index: 10; width: 100%;">
            <div class="about-glass-card">
                <div class="about-header">
                    <h1 style="font-size: 3.5rem; font-weight: 900; margin-bottom: 0.5rem; color: white;">About AviLearn</h1>
                <p style="font-size: 1.25rem; opacity: 0.9;">
                    Bridging amateur bird watching and ornithological science.
                </p>
            </div>

            <div class="about-content">
                <p>
                    AviLearn is an interactive digital learning hub designed for both budding bird enthusiasts and seasoned ornithologists. Our mission is to make bird identification accessible, scientifically accurate, and visually engaging.
                </p>
                <p>
                    This platform was beautifully crafted as part of an academic assignment utilizing <strong>ASP.NET Web Forms</strong>, demonstrating that classic server-rendered architectures can seamlessly deliver stunning, modern, app-like experiences.
                </p>
                
                <div class="tech-stack-card">
                    <h3 style="margin-bottom: 1rem; font-weight: 900; color: var(--color-nav-active);">Technology Stack</h3>
                    <ul style="list-style-type: none; margin-left: 0;">
                        <li style="margin-bottom: 0.75rem;"><strong style="color: var(--color-text-primary);">Frontend:</strong> Semantic HTML5, Vanilla CSS3 (Custom Design System), JavaScript (Intersection Observers, Video Backgrounds)</li>
                        <li style="margin-bottom: 0.75rem;"><strong style="color: var(--color-text-primary);">Backend:</strong> ASP.NET Web Forms (C# / .NET Framework 4.8)</li>
                        <li style="margin-bottom: 0.75rem;"><strong style="color: var(--color-text-primary);">Database:</strong> MySQL via ADO.NET (MySqlClient)</li>
                        <li style="margin-bottom: 0.75rem;"><strong style="color: var(--color-text-primary);">APIs:</strong> Wikipedia Image API, Xeno-canto Audio API</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
