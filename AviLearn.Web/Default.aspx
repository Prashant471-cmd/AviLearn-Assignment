<%@ Page Title="Home" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeFile="Default.aspx.cs"
    Inherits="AviLearn.Web.Default" %>

    <asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
        <style>
            .hero {
                display: grid;
                grid-template-columns: 1fr 1fr;
                align-items: center;
                padding: 2rem 5% 4rem 5%;
                min-height: calc(100vh - 120px);
                gap: 4rem;
            }

            /* --- Left Column: Text & Actions --- */
            .hero-content {
                display: flex;
                flex-direction: column;
                gap: 2.5rem;
                max-width: 600px;
            }

            .title-group h1 {
                font-size: 5rem;
                margin-bottom: 0.5rem;
            }

            .title-group p {
                font-size: 1.1rem;
                color: var(--color-text-light);
                font-weight: 600;
            }

            .hero-desc {
                font-size: 1.05rem;
                line-height: 1.7;
            }

            .action-group {
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }

            .read-more {
                font-weight: 900;
                font-size: 1.1rem;
                color: var(--color-text-primary);
            }

            .btn-icon {
                width: 48px;
                height: 48px;
                background: #fff;
                border: 2px solid var(--color-border);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--color-text-primary);
                text-decoration: none;
                transition: all 0.2s;
                font-weight: bold;
                font-size: 1.2rem;
                box-shadow: var(--shadow-sm);
            }

            .btn-icon:hover {
                border-color: var(--color-accent);
                color: var(--color-accent);
                transform: scale(1.05);
            }

            .social-pill {
                display: inline-flex;
                align-items: center;
                gap: 1.5rem;
                background: var(--color-accent);
                padding: 0.75rem 2rem;
                border-radius: var(--radius-pill);
                border-bottom-left-radius: 8px;
                /* Asymmetric styling */
                align-self: flex-start;
                margin-top: 1rem;
            }

            .social-pill a {
                color: #fff;
                text-decoration: none;
                font-weight: 800;
                font-size: 1.1rem;
                transition: opacity 0.2s;
            }

            .social-pill a:hover {
                opacity: 0.8;
            }

            /* --- Right Column: Visuals --- */
            .hero-visual {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 600px;
            }

            /* The massive background round shape behind the bird */
            .hero-visual::before {
                content: '';
                position: absolute;
                top: -30vh; /* Stretch far above the screen to hide flat top edge */
                bottom: -30vh; /* Stretch far below the screen */
                right: -50vw; /* Stretch far to the right */
                left: 10%; /* Beautiful curve on the left */
                background-color: #E0F2FE;
                border-top-left-radius: 50vw;
                border-bottom-left-radius: 50vw;
                z-index: 1;
            }

            /* True Transparent PNG of a Macaw */
            .bird-image {
                position: absolute;
                bottom: -15%;
                right: -10%;
                height: 125%;
                width: auto;
                max-width: none;
                object-fit: contain;
                object-position: bottom right;
                z-index: 2;
                filter: drop-shadow(-15px 25px 30px rgba(0, 0, 0, 0.4));
            }

            @media (max-width: 992px) {
                .hero {
                    grid-template-columns: 1fr;
                    gap: 2rem;
                    padding-top: 4rem;
                }

                .hero-visual {
                    min-height: 400px;
                }
            }
        </style>
    </asp:Content>

    <asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
        <div class="hero">

            <!-- Left Column -->
            <div class="hero-content">
                <div class="title-group">
                    <h1>Discover</h1>
                    <p>The amazing avian world</p>
                </div>

                <p class="hero-desc">
                    AviLearn is your ultimate companion for exploring and documenting bird species.
                    They are popular in aviculture and ornithological studies.
                    The greatest challenge threatening populations is rapid habitat loss, so education is our first step
                    toward conservation.
                </p>

                <div class="action-group">
                    <span class="read-more">Read more</span>
                    <% if (Session["UserRole"]==null) { %>
                        <a href="Register.aspx" class="btn-icon">&rarr;</a>
                        <% } else { %>
                            <a href="Dashboard.aspx" class="btn-icon">&rarr;</a>
                            <% } %>
                </div>

                <div class="social-pill">
                    <a href="#">f</a>
                    <a href="#">ig</a>
                    <a href="#">tw</a>
                </div>
            </div>

            <!-- Right Column -->
            <div class="hero-visual">
                <!-- Massive edge-bleeding true transparent PNG image -->
                <img src="images/macaw.png" alt="Macaw" class="bird-image" />
            </div>

        </div>
    </asp:Content>