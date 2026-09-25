<%@ Page Title="Sign In" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="Login.aspx.cs" Inherits="AviLearn.Web.Login" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        .auth-container {
            max-width: 900px;
            margin: 2rem auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            background: var(--color-bg-canvas);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-xl);
            overflow: hidden;
            height: 580px;
        }
        .auth-media {
            position: relative;
            background-color: var(--color-nav-active);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .auth-media video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
        }
        .auth-media-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.4) 0%, rgba(30, 58, 138, 0.8) 100%);
            z-index: 2;
        }
        .auth-media-content {
            position: relative;
            z-index: 3;
            text-align: center;
            color: white;
            padding: 2rem;
        }
        .auth-form-wrapper {
            padding: 2.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
        }
        .demo-creds {
            background-color: var(--color-bg-alt);
            padding: 0.75rem 1rem;
            border-radius: var(--radius-md);
            font-size: 0.8rem;
            border: 1px dashed var(--color-border);
            margin-top: 1rem;
        }
        .password-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }
        .password-toggle {
            position: absolute;
            right: 1rem;
            cursor: pointer;
            color: var(--color-text-muted);
            display: flex;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            padding: 0;
        }
        .password-toggle:hover {
            color: var(--color-nav-active);
        }
    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="container">
        <div class="auth-container">
            <!-- Left Column: Edge-to-edge Video -->
            <div class="auth-media">
                <video autoplay loop muted playsinline>
                    <source src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Flying_Birds_1_2022-12-05.webm" type="video/webm">
                </video>
                <div class="auth-media-overlay"></div>
                <div class="auth-media-content">
                    <h2 style="font-size: 2rem; font-weight: 900; margin-bottom: 0.5rem; color: white;">AviLearn</h2>
                    <p style="font-size: 1rem; opacity: 0.9;">Master the skies. Track your progress. Explore bird species.</p>
                </div>
            </div>

            <!-- Right Column: Login Form -->
            <div class="auth-form-wrapper">
                <h2 style="font-size: 2rem; font-weight: 900; color: var(--color-text-primary); margin-bottom: 0.25rem;">Log In</h2>
                <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">
                    Enter your email and password to login to our dashboard.
                </p>

                <asp:Label ID="lblError" runat="server" CssClass="form-error" Visible="false" style="display: block; margin-bottom: 1rem; padding: 0.5rem; background: #FEF2F2; color: #DC2626; border-radius: var(--radius-sm); font-weight: 700; font-size: 0.85rem;"></asp:Label>

                <div class="form-group" style="margin-bottom: 1rem;">
                    <label for="txtEmail" class="form-label" style="font-weight: 700; font-size: 0.85rem; margin-bottom: 0.25rem;">Email</label>
                    <asp:TextBox ID="txtEmail" runat="server" CssClass="form-input" TextMode="Email" Placeholder="info@avilearn.com" style="padding: 0.6rem 1rem;"></asp:TextBox>
                    <asp:RequiredFieldValidator ID="rfvEmail" runat="server" ControlToValidate="txtEmail" 
                        ErrorMessage="Email is required" CssClass="form-error" Display="Dynamic"></asp:RequiredFieldValidator>
                </div>

                <div class="form-group" style="margin-bottom: 1.5rem;">
                    <label for="txtPassword" class="form-label" style="font-weight: 700; font-size: 0.85rem; margin-bottom: 0.25rem;">Password</label>
                    <div class="password-wrapper">
                        <asp:TextBox ID="txtPassword" runat="server" CssClass="form-input" TextMode="Password" style="padding: 0.6rem 3rem 0.6rem 1rem;" Placeholder="Enter your Password"></asp:TextBox>
                        <button type="button" class="password-toggle" id="btnTogglePassword" aria-label="Toggle password visibility">
                            <svg id="eyeIcon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <svg id="eyeOffIcon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        </button>
                    </div>
                    <asp:RequiredFieldValidator ID="rfvPassword" runat="server" ControlToValidate="txtPassword" 
                        ErrorMessage="Password is required" CssClass="form-error" Display="Dynamic"></asp:RequiredFieldValidator>
                </div>

                <asp:Button ID="btnLogin" runat="server" Text="Sign In" CssClass="btn btn-primary btn-full" OnClick="btnLogin_Click" style="padding: 0.75rem; font-size: 1rem; font-weight: 800; background: var(--color-nav-active); color: white;" />

                <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem;">
                    <span>Don't have an account? <a href="Register.aspx" style="color: var(--color-nav-active); font-weight: 700; text-decoration: none;">Sign Up</a></span>
                    <a href="#" style="color: var(--color-nav-active); font-weight: 700; text-decoration: none;">Forget Password?</a>
                </div>
                
                <div class="demo-creds">
                    <p style="font-weight: 800; margin-bottom: 0.25rem; color: var(--color-text-primary);">Demo Accounts</p>
                    <div style="margin-bottom: 0.25rem;">
                        <span style="font-weight: 700; color: #047857;">Member:</span>
                        <code style="background: white; padding: 0.1rem 0.3rem; border-radius: 4px;">member@avilearn.com</code> / <code style="background: white; padding: 0.1rem 0.3rem; border-radius: 4px;">Member123!</code>
                    </div>
                    <div>
                        <span style="font-weight: 700; color: #1D4ED8;">Admin:</span>
                        <code style="background: white; padding: 0.1rem 0.3rem; border-radius: 4px;">admin@avilearn.com</code> / <code style="background: white; padding: 0.1rem 0.3rem; border-radius: 4px;">Admin123!</code>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const toggleBtn = document.getElementById("btnTogglePassword");
            const passwordInput = document.getElementById("<%= txtPassword.ClientID %>");
            const eyeIcon = document.getElementById("eyeIcon");
            const eyeOffIcon = document.getElementById("eyeOffIcon");

            toggleBtn.addEventListener("click", function(e) {
                e.preventDefault(); // Prevent form submission
                
                if (passwordInput.type === "password") {
                    passwordInput.type = "text";
                    eyeIcon.style.display = "none";
                    eyeOffIcon.style.display = "block";
                } else {
                    passwordInput.type = "password";
                    eyeIcon.style.display = "block";
                    eyeOffIcon.style.display = "none";
                }
            });
        });
    </script>
</asp:Content>
