<%@ Page Title="Manage Bird Species" Language="C#" MasterPageFile="~/Admin/AdminMaster.master" AutoEventWireup="true" CodeFile="BirdSpecies.aspx.cs" Inherits="AviLearn.Web.Admin.BirdSpecies" %>

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
        <h2 style="margin-bottom: 1rem;">Add New Species</h2>
        
        <asp:Label ID="lblMsg" runat="server" Visible="false" style="display: block; margin-bottom: 1rem; color: var(--color-emerald); font-weight: bold;"></asp:Label>
        
        <div class="form-grid">
            <div class="form-group">
                <label class="form-label">Common Name</label>
                <asp:TextBox ID="txtCommonName" runat="server" CssClass="form-input"></asp:TextBox>
            </div>
            <div class="form-group">
                <label class="form-label">Scientific Name</label>
                <asp:TextBox ID="txtScientificName" runat="server" CssClass="form-input"></asp:TextBox>
            </div>
            <div class="form-group">
                <label class="form-label">Family</label>
                <asp:TextBox ID="txtFamily" runat="server" CssClass="form-input"></asp:TextBox>
            </div>
            <div class="form-group">
                <label class="form-label">Conservation Status</label>
                <asp:DropDownList ID="ddlStatus" runat="server" CssClass="form-input">
                    <asp:ListItem Text="Least Concern (LC)" Value="LC"></asp:ListItem>
                    <asp:ListItem Text="Near Threatened (NT)" Value="NT"></asp:ListItem>
                    <asp:ListItem Text="Vulnerable (VU)" Value="VU"></asp:ListItem>
                    <asp:ListItem Text="Endangered (EN)" Value="EN"></asp:ListItem>
                    <asp:ListItem Text="Critically Endangered (CR)" Value="CR"></asp:ListItem>
                </asp:DropDownList>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
                <label class="form-label">Description</label>
                <asp:TextBox ID="txtDesc" runat="server" CssClass="form-input" TextMode="MultiLine" Rows="3"></asp:TextBox>
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
                <label class="form-label">Image URL</label>
                <asp:TextBox ID="txtImgUrl" runat="server" CssClass="form-input"></asp:TextBox>
            </div>
        </div>
        
        <asp:Button ID="btnAdd" runat="server" Text="Add Species" CssClass="btn btn-primary" OnClick="btnAdd_Click" />
    </div>

    <div class="card">
        <h2 style="margin-bottom: 1rem;">Existing Species Directory</h2>
        
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
