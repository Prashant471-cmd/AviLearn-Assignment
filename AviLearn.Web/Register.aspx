<%@ Page Title="Create Account" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="Register.aspx.cs" Inherits="AviLearn.Web.Register" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        .auth-container {
            max-width: 450px;
            margin: 4rem auto;
        }
    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="container">
        <div class="auth-container card">
            <h2 style="margin-bottom: 0.5rem;">Create Account</h2>
            <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 2rem;">
                Join the AviLearn community to access quizzes and track your life list.
            </p>

            <asp:Label ID="lblMessage" runat="server" CssClass="form-error" Visible="false" style="display: block; margin-bottom: 1rem;"></asp:Label>

            <div class="form-group">
                <label for="txtName" class="form-label">Full Name</label>
                <asp:TextBox ID="txtName" runat="server" CssClass="form-input"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvName" runat="server" ControlToValidate="txtName" 
                    ErrorMessage="Name is required" CssClass="form-error" Display="Dynamic"></asp:RequiredFieldValidator>
            </div>

            <div class="form-group">
                <label for="txtEmail" class="form-label">Email Address</label>
                <asp:TextBox ID="txtEmail" runat="server" CssClass="form-input" TextMode="Email"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvEmail" runat="server" ControlToValidate="txtEmail" 
                    ErrorMessage="Email is required" CssClass="form-error" Display="Dynamic"></asp:RequiredFieldValidator>
                <asp:RegularExpressionValidator ID="revEmail" runat="server" ControlToValidate="txtEmail"
                    ValidationExpression="^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$" 
                    ErrorMessage="Invalid email format" CssClass="form-error" Display="Dynamic"></asp:RegularExpressionValidator>
            </div>

            <div class="form-group">
                <label for="txtPassword" class="form-label">Password</label>
                <asp:TextBox ID="txtPassword" runat="server" CssClass="form-input" TextMode="Password"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvPassword" runat="server" ControlToValidate="txtPassword" 
                    ErrorMessage="Password is required" CssClass="form-error" Display="Dynamic"></asp:RequiredFieldValidator>
                <asp:RegularExpressionValidator ID="revPassword" runat="server" ControlToValidate="txtPassword"
                    ValidationExpression="^.{8,}$" ErrorMessage="Minimum 8 characters required" CssClass="form-error" Display="Dynamic"></asp:RegularExpressionValidator>
            </div>
            
            <div class="form-group">
                <label for="txtConfirm" class="form-label">Confirm Password</label>
                <asp:TextBox ID="txtConfirm" runat="server" CssClass="form-input" TextMode="Password"></asp:TextBox>
                <asp:RequiredFieldValidator ID="rfvConfirm" runat="server" ControlToValidate="txtConfirm" 
                    ErrorMessage="Please confirm your password" CssClass="form-error" Display="Dynamic"></asp:RequiredFieldValidator>
                <asp:CompareValidator ID="cvPassword" runat="server" ControlToCompare="txtPassword" ControlToValidate="txtConfirm"
                    ErrorMessage="Passwords do not match" CssClass="form-error" Display="Dynamic"></asp:CompareValidator>
            </div>

            <asp:Button ID="btnRegister" runat="server" Text="Create My Account" CssClass="btn btn-primary btn-full" OnClick="btnRegister_Click" style="margin-top: 1rem;" />
        </div>
    </div>
</asp:Content>
