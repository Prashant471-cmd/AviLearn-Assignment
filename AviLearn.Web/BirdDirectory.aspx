<%@ Page Title="Bird Directory" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="BirdDirectory.aspx.cs" Inherits="AviLearn.Web.BirdDirectory" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        .directory-header {
            background: linear-gradient(135deg, #F7F5F0 0%, #E5E2D9 100%);
            padding: 3rem 0;
            border-bottom: 1px solid var(--color-border);
        }
        .bird-card {
            display: flex;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
            transition: transform 0.2s ease;
        }
        .bird-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 36px rgba(0,0,0,0.1);
        }
        .bird-img {
            width: 200px;
            height: 150px;
            object-fit: cover;
            border-radius: var(--radius-sm);
        }
        .bird-info {
            flex: 1;
        }
        .bird-name {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
        }
        .bird-sci {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 0.875rem;
            font-style: italic;
            color: var(--color-text-muted);
            margin-bottom: 0.75rem;
        }
        .bird-desc {
            font-size: 0.875rem;
            color: var(--color-text-muted);
            margin-bottom: 1rem;
        }
        .audio-btn {
            background-color: var(--color-accent);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: var(--radius-sm);
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            cursor: pointer;
        }
        .audio-btn:hover {
            background-color: var(--color-accent-hover);
        }
    </style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="directory-header">
        <div class="container">
            <h1 style="font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 0.5rem;">Bird Species Directory</h1>
            <p style="color: var(--color-text-muted); max-width: 600px;">
                Browse documented bird species with taxonomy, field marks, audio calls, and conservation data.
            </p>
        </div>
    </div>

    <div class="container section">
        <div class="card" style="margin-bottom: 2rem;">
            <div style="display: flex; gap: 1rem;">
                <asp:TextBox ID="txtSearch" runat="server" CssClass="form-input" Placeholder="Search by common or scientific name..."></asp:TextBox>
                <asp:Button ID="btnSearch" runat="server" Text="Search" CssClass="btn btn-primary" OnClick="btnSearch_Click" />
            </div>
        </div>

        <asp:Repeater ID="rptBirds" runat="server">
            <ItemTemplate>
                <div class="card bird-card">
                    <img src='<%# Eval("ImageUrl") %>' alt='<%# Eval("CommonName") %>' class="bird-img" onerror="this.src='/images/placeholder.jpg'" />
                    <div class="bird-info">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <div class="bird-name"><%# Eval("CommonName") %></div>
                                <div class="bird-sci"><%# Eval("ScientificName") %> &middot; <%# Eval("Family") %></div>
                            </div>
                            <span class="badge badge-default"><%# Eval("ConservationStatus") %></span>
                        </div>
                        <div class="bird-desc"><%# Eval("Description") %></div>
                        
                        <div style="display: flex; gap: 1rem;">
                            <button type="button" class="audio-btn" onclick='playBirdCall(<%# Eval("AudioFrequencyHz") %>, "<%# Eval("AudioPattern") %>")'>
                                ▶ Play Call
                            </button>
                            <span style="font-size: 0.75rem; color: var(--color-text-muted); display: flex; align-items: center;">
                                <strong>Habitat:</strong>&nbsp;<%# Eval("Habitat") %>
                            </span>
                        </div>
                    </div>
                </div>
            </ItemTemplate>
        </asp:Repeater>
        
        <asp:Label ID="lblNoResults" runat="server" Visible="false" Text="No species found matching your search." style="display: block; text-align: center; padding: 2rem; color: var(--color-text-muted);"></asp:Label>
    </div>

    <!-- Web Audio API Script for inline playback -->
    <script>
        function playBirdCall(freq, pattern) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx || !freq) return;

            const ctx = new AudioCtx();
            const tone = (f, start, dur) => {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.connect(g); g.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, ctx.currentTime + start);
                g.gain.setValueAtTime(0, ctx.currentTime + start);
                g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + start + 0.04);
                g.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur);
                osc.start(ctx.currentTime + start);
                osc.stop(ctx.currentTime + start + dur + 0.05);
            };

            if (pattern === 'chirp-repeat') { 
                for (let i = 0; i < 5; i++) tone(freq, i * 0.22, 0.14); 
            } else { 
                tone(freq, 0, 0.4); 
                tone(freq * 1.25, 0.45, 0.35); 
            }
        }
    </script>
</asp:Content>
