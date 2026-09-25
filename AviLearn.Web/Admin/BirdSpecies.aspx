<%@ Page Title="Manage Bird Species" Async="true" Language="C#" MasterPageFile="~/Admin/AdminMaster.master" AutoEventWireup="true" CodeFile="BirdSpecies.aspx.cs" Inherits="AviLearn.Web.Admin.BirdSpecies" %>

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
        <h2 style="margin-bottom: 2rem; color: var(--color-text-primary); font-weight: 900;">Add New Species</h2>
        
        <asp:Label ID="lblMsg" runat="server" Visible="false" style="display: block; margin-bottom: 1.5rem; color: #10B981; font-weight: 800; background: #D1FAE5; padding: 1rem; border-radius: var(--radius-sm);"></asp:Label>
        
        <div class="form-grid">
            <div class="form-group">
                <label class="form-label" style="font-weight: 700;">Common Name</label>
                <asp:TextBox ID="txtCommonName" runat="server" CssClass="form-input"></asp:TextBox>
            </div>
            <div class="form-group">
                <label class="form-label" style="font-weight: 700;">Scientific Name</label>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <asp:TextBox ID="txtScientificName" runat="server" CssClass="form-input" style="flex: 1;"></asp:TextBox>
                    <asp:Button ID="btnFetchXenoCanto" runat="server" Text="Fetch from Xeno-canto" CssClass="btn btn-primary" style="padding: 0.75rem 1.5rem; font-weight: 800;" OnClick="btnFetchXenoCanto_Click" CausesValidation="false" formnovalidate="formnovalidate" />
                </div>
                <asp:Label ID="lblXenoCantoMsg" runat="server" Visible="false" style="display: block; margin-top: 0.5rem; font-size: 0.9em;"></asp:Label>
            </div>
            <div class="form-group">
                <label class="form-label" style="font-weight: 700;">Family</label>
                <asp:TextBox ID="txtFamily" runat="server" CssClass="form-input"></asp:TextBox>
            </div>
            <div class="form-group">
                <label class="form-label" style="font-weight: 700;">Conservation Status</label>
                <asp:DropDownList ID="ddlStatus" runat="server" CssClass="form-input">
                    <asp:ListItem Text="Least Concern (LC)" Value="LC"></asp:ListItem>
                    <asp:ListItem Text="Near Threatened (NT)" Value="NT"></asp:ListItem>
                    <asp:ListItem Text="Vulnerable (VU)" Value="VU"></asp:ListItem>
                    <asp:ListItem Text="Endangered (EN)" Value="EN"></asp:ListItem>
                    <asp:ListItem Text="Critically Endangered (CR)" Value="CR"></asp:ListItem>
                </asp:DropDownList>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
                <label class="form-label" style="font-weight: 700;">Description</label>
                <asp:TextBox ID="txtDesc" runat="server" CssClass="form-input" TextMode="MultiLine" Rows="3"></asp:TextBox>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
                <label class="form-label" style="font-weight: 700;">Image URL (Optional)</label>
                <asp:TextBox ID="txtImgUrl" runat="server" CssClass="form-input" Placeholder="Leave blank to auto-fetch from Wikipedia"></asp:TextBox>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
                <label class="form-label" style="font-weight: 700;">Audio URL</label>
                <asp:TextBox ID="txtAudioUrl" runat="server" CssClass="form-input"></asp:TextBox>
            </div>
        </div>
        
        <asp:Button ID="btnAdd" runat="server" Text="Add Species" CssClass="btn btn-primary" style="margin-top: 1.5rem; padding: 1rem 2rem; font-size: 1.1rem; font-weight: 800;" OnClick="btnAdd_Click" />
    </div>

    <div class="admin-card">
        <h2 style="margin-bottom: 2rem; color: var(--color-text-primary); font-weight: 900;">Existing Species Directory</h2>
        
        <asp:GridView ID="gvBirds" runat="server" AutoGenerateColumns="False" 
            CssClass="data-table" GridLines="None" DataKeyNames="Id"
            OnRowDeleting="gvBirds_RowDeleting" EmptyDataText="No species found.">
            <Columns>
                <asp:BoundField DataField="CommonName" HeaderText="Common Name" />
                <asp:BoundField DataField="ScientificName" HeaderText="Scientific Name" />
                <asp:BoundField DataField="Family" HeaderText="Family" />
                <asp:BoundField DataField="ConservationStatus" HeaderText="Status" />
                <asp:CommandField ShowDeleteButton="True" ControlStyle-CssClass="btn btn-ghost" ControlStyle-ForeColor="#D32F2F" />
            </Columns>
        </asp:GridView>
    </div>
</asp:Content>
