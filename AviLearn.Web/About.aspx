<%@ Page Title="About AviLearn" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="About.aspx.cs" Inherits="AviLearn.Web.About" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        .about-header {
            text-align: center;
            padding: 4rem 0;
        }
        .about-content {
            max-width: 800px;
            margin: 0 auto;
            font-size: 1.125rem;
            color: #4A4A4A;
        }
        .about-content p {
            margin-bottom: 1.5rem;
        }
    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="container section">
        <div class="about-header">
            <h1 style="font-size: 3rem; margin-bottom: 1rem;">About AviLearn</h1>
            <p style="font-family: 'Newsreader', serif; font-style: italic; font-size: 1.25rem;">
                Bridging amateur bird watching and ornithological science.
            </p>
        </div>

        <div class="about-content">
            <p>
                AviLearn is an interactive digital learning hub designed for both budding bird enthusiasts and seasoned ornithologists. Our mission is to make bird identification accessible, scientifically accurate, and engaging through interactive learning modules.
            </p>
            <p>
                This platform was built as part of an academic assignment utilizing <strong>ASP.NET Web Forms</strong>, demonstrating a classic server-rendered architecture with ADO.NET and MySQL integration.
            </p>
            
            <div class="card" style="margin-top: 3rem; background-color: #F7F5F0;">
                <h3 style="margin-bottom: 1rem; color: #3D4435;">Technology Stack</h3>
                <ul style="list-style-position: inside; margin-left: 1rem; color: #4A4A4A;">
                    <li style="margin-bottom: 0.5rem;"><strong>Frontend:</strong> Semantic HTML5, CSS3 (External, Internal, Inline mix), Vanilla JS</li>
                    <li style="margin-bottom: 0.5rem;"><strong>Backend:</strong> ASP.NET Web Forms (C# / .NET Framework 4.8)</li>
                    <li style="margin-bottom: 0.5rem;"><strong>Database:</strong> MySQL via ADO.NET (MySqlClient)</li>
                    <li style="margin-bottom: 0.5rem;"><strong>Security:</strong> Forms Authentication</li>
                </ul>
            </div>
        </div>
    </div>
</asp:Content>
