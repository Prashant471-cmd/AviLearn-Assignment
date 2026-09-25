<%@ Page Title="Activity Overview" Language="C#" MasterPageFile="~/Admin/AdminMaster.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="AviLearn.Web.Admin.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        .stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        .stat-card {
            background-color: white;
            padding: 1.5rem;
            border-radius: var(--radius-md);
            border: 1px solid var(--color-border);
            text-align: center;
        }
        .stat-card h3 {
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--color-text-light);
            font-weight: 800;
            margin-bottom: 0.5rem;
        }
        .stat-card .value {
            font-size: 3rem;
            font-weight: 900;
            color: var(--color-nav-active);
        }
    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="stat-grid">
        <div class="stat-card">
            <h3>Total Users</h3>
            <div class="value"><asp:Literal ID="litTotalUsers" runat="server">0</asp:Literal></div>
        </div>
        <div class="stat-card">
            <h3>Bird Species</h3>
            <div class="value"><asp:Literal ID="litTotalBirds" runat="server">0</asp:Literal></div>
        </div>
        <div class="stat-card">
            <h3>Quizzes Taken</h3>
            <div class="value"><asp:Literal ID="litTotalQuizzes" runat="server">0</asp:Literal></div>
        </div>
    </div>

    <div class="admin-card">
        <h2 style="margin-bottom: 2rem; color: var(--color-text-primary); font-weight: 900;">Recent User Registrations</h2>
        <asp:GridView ID="gvRecentUsers" runat="server" AutoGenerateColumns="False" 
            CssClass="data-table" GridLines="None" EmptyDataText="No users found.">
            <Columns>
                <asp:BoundField DataField="Name" HeaderText="Name" />
                <asp:BoundField DataField="Email" HeaderText="Email" />
                <asp:BoundField DataField="Role" HeaderText="Role" />
                <asp:BoundField DataField="JoinDate" HeaderText="Join Date" DataFormatString="{0:MMM dd, yyyy}" />
            </Columns>
        </asp:GridView>
    </div>
</asp:Content>
