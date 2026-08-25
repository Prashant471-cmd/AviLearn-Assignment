<%@ Page Title="Manage Users" Language="C#" MasterPageFile="~/Admin/AdminMaster.master" AutoEventWireup="true" CodeFile="Users.aspx.cs" Inherits="AviLearn.Web.Admin.Users" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="card" style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 1rem;">Add New User</h2>
        
        <asp:Label ID="lblMsg" runat="server" Visible="false" style="display: block; margin-bottom: 1rem; color: var(--color-emerald); font-weight: bold;"></asp:Label>
        
        <div class="form-grid">
            <div class="form-group">
                <label class="form-label">Name</label>
                <asp:TextBox ID="txtName" runat="server" CssClass="form-input"></asp:TextBox>
            </div>
            <div class="form-group">
                <label class="form-label">Email</label>
                <asp:TextBox ID="txtEmail" runat="server" CssClass="form-input"></asp:TextBox>
            </div>
            <div class="form-group">
                <label class="form-label">Password</label>
                <asp:TextBox ID="txtPassword" runat="server" CssClass="form-input" TextMode="Password"></asp:TextBox>
            </div>
            <div class="form-group">
                <label class="form-label">Role</label>
                <asp:DropDownList ID="ddlRole" runat="server" CssClass="form-input">
                    <asp:ListItem Text="Member" Value="member"></asp:ListItem>
                    <asp:ListItem Text="Admin" Value="admin"></asp:ListItem>
                </asp:DropDownList>
            </div>
        </div>
        
        <asp:Button ID="btnAdd" runat="server" Text="Add User" CssClass="btn btn-primary" OnClick="btnAdd_Click" />
    </div>

    <div class="card">
        <h2 style="margin-bottom: 1rem;">Existing Users</h2>
        
        <asp:GridView ID="gvUsers" runat="server" AutoGenerateColumns="False" 
            CssClass="data-table" GridLines="None" DataKeyNames="Id"
            OnRowDeleting="gvUsers_RowDeleting" EmptyDataText="No users found.">
            <Columns>
                <asp:BoundField DataField="Name" HeaderText="Name" />
                <asp:BoundField DataField="Email" HeaderText="Email" />
                <asp:BoundField DataField="Role" HeaderText="Role" />
                <asp:BoundField DataField="XP" HeaderText="XP" />
                <asp:BoundField DataField="JoinDate" HeaderText="Join Date" DataFormatString="{0:MMM dd, yyyy}" />
                <asp:CommandField ShowDeleteButton="True" ControlStyle-CssClass="btn btn-ghost" ControlStyle-ForeColor="#D32F2F" />
            </Columns>
        </asp:GridView>
    </div>
</asp:Content>
