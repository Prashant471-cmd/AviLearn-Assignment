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
    <div class="admin-card" style="margin-bottom: 3rem;">
        <h2 style="margin-bottom: 2rem; color: var(--color-text-primary); font-weight: 900;">Add New User</h2>
        
        <asp:Label ID="lblMsg" runat="server" Visible="false" style="display: block; margin-bottom: 1.5rem; color: #10B981; font-weight: 800; background: #D1FAE5; padding: 1rem; border-radius: var(--radius-sm);"></asp:Label>
        
        <div class="form-grid">
            <div class="form-group">
                <label class="form-label" style="font-weight: 700;">Name</label>
                <asp:TextBox ID="txtName" runat="server" CssClass="form-input"></asp:TextBox>
            </div>
            <div class="form-group">
                <label class="form-label" style="font-weight: 700;">Email</label>
                <asp:TextBox ID="txtEmail" runat="server" CssClass="form-input"></asp:TextBox>
            </div>
            <div class="form-group">
                <label class="form-label" style="font-weight: 700;">Password</label>
                <asp:TextBox ID="txtPassword" runat="server" CssClass="form-input" TextMode="Password"></asp:TextBox>
            </div>
            <div class="form-group">
                <label class="form-label" style="font-weight: 700;">Role</label>
                <asp:DropDownList ID="ddlRole" runat="server" CssClass="form-input">
                    <asp:ListItem Text="Member" Value="member"></asp:ListItem>
                    <asp:ListItem Text="Admin" Value="admin"></asp:ListItem>
                </asp:DropDownList>
            </div>
        </div>
        
        <asp:Button ID="btnAdd" runat="server" Text="Add User" CssClass="btn btn-primary" style="margin-top: 1.5rem; padding: 1rem 2rem; font-size: 1.1rem; font-weight: 800;" OnClick="btnAdd_Click" />
    </div>

    <div class="admin-card">
        <h2 style="margin-bottom: 2rem; color: var(--color-text-primary); font-weight: 900;">Existing Users</h2>
        
        <style>
            .role-badge {
                padding: 0.25rem 0.75rem;
                border-radius: var(--radius-pill);
                font-weight: 800;
                font-size: 0.8rem;
                display: inline-block;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .role-admin {
                background: #DBEAFE;
                color: #1D4ED8;
                border: 1px solid #BFDBFE;
            }
            .role-member {
                background: #D1FAE5;
                color: #047857;
                border: 1px solid #A7F3D0;
            }
            .user-name {
                font-weight: 800;
                color: var(--color-text-primary);
                font-size: 1.05rem;
            }
            .user-email {
                color: var(--color-text-muted);
                font-size: 0.9rem;
            }
            .xp-col {
                font-weight: 800;
                color: var(--color-accent);
            }
            .date-col {
                color: var(--color-text-muted);
            }
        </style>

        <asp:GridView ID="gvUsers" runat="server" AutoGenerateColumns="False" 
            CssClass="data-table" GridLines="None" DataKeyNames="Id"
            OnRowDeleting="gvUsers_RowDeleting" EmptyDataText="No users found.">
            <Columns>
                <asp:TemplateField HeaderText="User Info">
                    <ItemTemplate>
                        <div>
                            <div class="user-name"><%# Eval("Name") %></div>
                            <div class="user-email"><%# Eval("Email") %></div>
                        </div>
                    </ItemTemplate>
                </asp:TemplateField>
                <asp:TemplateField HeaderText="Role">
                    <ItemTemplate>
                        <span class='role-badge <%# Eval("Role").ToString().ToLower() == "admin" ? "role-admin" : "role-member" %>'>
                            <%# Eval("Role") %>
                        </span>
                    </ItemTemplate>
                </asp:TemplateField>
                <asp:BoundField DataField="XP" HeaderText="XP Points" ItemStyle-CssClass="xp-col" />
                <asp:BoundField DataField="JoinDate" HeaderText="Join Date" DataFormatString="{0:MMM dd, yyyy}" ItemStyle-CssClass="date-col" />
                <asp:CommandField ShowDeleteButton="True" ControlStyle-CssClass="btn btn-ghost" ControlStyle-ForeColor="#DC2626" />
            </Columns>
        </asp:GridView>
    </div>
</asp:Content>
