<%@ Page Title="Sign In" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="Login.aspx.cs" Inherits="AviLearn.Web.Login" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        .auth-container {
            max-width: 400px;
            margin: 4rem auto;
        }
        .demo-creds {
            background-color: var(--color-surface-alt);
            padding: 1rem;
            border-radius: var(--radius-md);
            margin-bottom: 1.5rem;
            font-size: 0.75rem;
        }
    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="container">
        <div class="auth-container card">
            <h2 style="margin-bottom: 0.5rem;">Sign In</h2>
            <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 2rem;">
                Don't have an account? <a href="Register.aspx" style="color: var(--color-accent); font-weight: 700;">Register free</a>
            </p>

            <div class="demo-creds">
                <p style="font-weight: 700; margin-bottom: 0.5rem;">Demo Accounts:</p>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                    <span>Member: <code>member@avilearn.com</code> / <code>Member123!</code></span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Admin: <code>admin@avilearn.com</code> / <code>Admin123!</code></span>
                </div>
            </div>

            <asp:Label ID="lblError" runat="server" CssClass="form-error" Visible="false" style="display: block; margin-bottom: 1rem;"></asp:Label>

            <div class="form-group">
                <label for="txtEmail" class="form-label">Email Address</label>
                <asp:TextBox ID="txtEmail" runat="server" CssClass="form-input" TextMode="Email"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvEmail" runat="server" ControlToValidate="txtEmail" 
                    ErrorMessage="Email is required" CssClass="form-error" Display="Dynamic"></asp:RequiredFieldValidator>
            </div>

            <div class="form-group">
                <label for="txtPassword" class="form-label">Password</label>
                <asp:TextBox ID="txtPassword" runat="server" CssClass="form-input" TextMode="Password"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvPassword" runat="server" ControlToValidate="txtPassword" 
                    ErrorMessage="Password is required" CssClass="form-error" Display="Dynamic"></asp:RequiredFieldValidator>
            </div>

            <asp:Button ID="btnLogin" runat="server" Text="Sign In to AviLearn" CssClass="btn btn-primary btn-full" OnClick="btnLogin_Click" style="margin-top: 1rem;" />
        </div>
    </div>
</asp:Content>
