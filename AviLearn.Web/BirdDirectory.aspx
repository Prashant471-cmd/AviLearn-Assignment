<%@ Page Title="Bird Directory" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true"
    CodeFile="BirdDirectory.aspx.cs" Inherits="AviLearn.Web.BirdDirectory" %>

    <asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
        <style>
            body {
                position: relative;
            }

            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('/images/left_plant.png'), url('/images/right_plant.png');
                background-position: left bottom, right bottom;
                background-repeat: no-repeat, no-repeat;
                background-size: auto 90%, auto 90%;
                opacity: 0.15;
                z-index: 0;
                pointer-events: none;
            }

            .directory-wrapper {
                max-width: 1300px;
                margin: 0 auto;
                padding: 2rem 0;
                position: relative;
                z-index: 10;
            }

            .page-header {
                padding: 3rem 3rem 2.5rem 3rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                gap: 1rem;
            }

            .page-title {
                font-size: 3.5rem;
                margin-bottom: 0.25rem;
                color: var(--color-text-primary);
            }

            .page-subtitle {
                font-size: 1.15rem;
                color: var(--color-text-light);
                font-weight: 500;
                line-height: 1.6;
                max-width: 700px;
            }

            .bird-card {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6rem;
                padding: 3rem;
                margin-bottom: 4rem;
                background: transparent;
                opacity: 0;
                transform: translateY(40px);
                transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .bird-card.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .bird-card.visible:hover {
                transform: translateY(-4px);
                transition: transform 0.2s ease;
            }

            .bird-img {
                max-width: 500px;
                max-height: 440px;
                width: auto;
                height: auto;
                object-fit: cover;
                object-position: center;
                border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                animation: morphBlob 8s ease-in-out infinite;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05);
            }

            @keyframes morphBlob {
                0% {
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                }

                50% {
                    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
                }

                100% {
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                }
            }

            .bird-info {
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 480px;
                flex-shrink: 0;
            }

            .bird-name {
                font-size: 3.5rem;
                font-weight: 900;
                color: var(--color-text-primary);
                margin-bottom: 2rem;
                position: relative;
                padding-bottom: 1rem;
            }

            .bird-name::after {
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                width: 60px;
                height: 4px;
                background: var(--color-accent);
                border-radius: 2px;
            }

            .bird-stats {
                margin-bottom: 2rem;
            }

            .bird-stat-line {
                display: flex;
                font-size: 1.1rem;
                margin-bottom: 0.85rem;
                color: var(--color-text-muted);
            }

            .bird-stat-label {
                width: 140px;
                font-weight: 600;
                color: var(--color-text-light);
            }

            .bird-stat-value {
                font-weight: 600;
                color: var(--color-text-primary);
            }

            .badge {
                padding: 0.25rem 0.75rem;
                border-radius: var(--radius-pill);
                font-weight: 800;
                font-size: 0.85rem;
                background: #E0F2FE;
                color: var(--color-nav-active);
                border: 1px solid #BAE6FD;
            }

            .search-container {
                display: flex;
                align-items: center;
                max-width: 800px;
                margin: 0 auto 4rem auto;
                background: var(--color-bg-canvas);
                padding: 0.5rem;
                border-radius: 50px;
                border: 3px solid var(--color-border);
                box-shadow: var(--shadow-sm);
            }

            .search-container .form-input {
                flex: 1;
                font-size: 1.1rem;
                font-weight: 700;
                color: var(--color-text-primary);
                background: transparent;
                border: none;
                text-align: left;
                padding: 1rem 2rem;
                outline: none;
            }

            .search-container .form-input:focus {
                outline: none !important;
                box-shadow: none !important;
                border: none !important;
            }

            .search-container .form-input::placeholder {
                color: var(--color-text-light);
                font-weight: 700;
            }

            .search-container .search-btn {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: var(--color-accent);
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s;
                flex-shrink: 0;
            }

            .search-container .search-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
            }

            @media (max-width: 768px) {
                .bird-card {
                    flex-direction: column;
                    gap: 1.5rem;
                    padding: 1.5rem;
                }

                .bird-img {
                    width: 100%;
                    height: 250px;
                }

                .page-title {
                    font-size: 3rem;
                }
            }
        </style>
    </asp:Content>

    <asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
        <div class="container page-transition directory-wrapper">
            <div class="page-header">
                <h1 class="page-title">Species</h1>
                <p class="page-subtitle">Browse documented bird species with taxonomy, field marks, audio calls, and
                    conservation data.</p>
            </div>

            <div class="search-container">
                <asp:TextBox ID="txtSearch" runat="server" CssClass="form-input"
                    Placeholder="Search by common or scientific name..."></asp:TextBox>
                <asp:LinkButton ID="btnSearch" runat="server" CssClass="search-btn" OnClick="btnSearch_Click">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f8fafc" stroke-width="3"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </asp:LinkButton>
            </div>

            <asp:Repeater ID="rptBirds" runat="server">
                <ItemTemplate>
                    <div class="bird-card">
                        <div class="bird-info">
                            <div class="bird-name">
                                <%# Eval("CommonName") %>
                            </div>

                            <div class="bird-stats">
                                <div class="bird-stat-line">
                                    <span class="bird-stat-label">Common Name</span>
                                    <span class="bird-stat-value">: <%# Eval("CommonName") %></span>
                                </div>
                                <div class="bird-stat-line">
                                    <span class="bird-stat-label">Scientific Name</span>
                                    <span class="bird-stat-value">: <%# Eval("ScientificName") %></span>
                                </div>
                                <div class="bird-stat-line">
                                    <span class="bird-stat-label">Family</span>
                                    <span class="bird-stat-value">: <%# Eval("Family") %></span>
                                </div>
                                <div class="bird-stat-line">
                                    <span class="bird-stat-label">Habitat</span>
                                    <span class="bird-stat-value">: <%# Eval("Habitat") %></span>
                                </div>
                                <div class="bird-stat-line">
                                    <span class="bird-stat-label">Conservation</span>
                                    <span class="bird-stat-value">: <span class="badge">
                                            <%# Eval("ConservationStatus") %>
                                        </span></span>
                                </div>
                            </div>

                            <div class="audio-container">
                                <%# string.IsNullOrEmpty(Eval("AudioUrl") as string)
                                    ? "<span style='color: var(--color-text-light); font-size: 0.95rem; font-weight: 700; display: inline-block;'>Audio sample unavailable</span>"
                                    : string.Format("<audio controls style='height: 44px; outline: none; width: 100%; max-width: 300px;'><source src='{0}' type='audio/mpeg' />Your browser does not support the audio element.</audio>", Eval("AudioUrl"))
                                %>
                            </div>
                        </div>

                        <img src='<%# Eval("ImageUrl") %>' data-common-name='<%# Eval("CommonName") %>'
                            data-scientific-name='<%# Eval("ScientificName") %>' alt='<%# Eval("CommonName") %>'
                            class="bird-img" onerror="this.onerror=null; this.src='/images/placeholder.png';" />
                    </div>
                </ItemTemplate>
            </asp:Repeater>

            <asp:Label ID="lblNoResults" runat="server" Visible="false" Text="No species found matching your search."
                style="display: block; text-align: center; padding: 3rem; font-size: 1.2rem; font-weight: 700; color: var(--color-text-light);">
            </asp:Label>
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

            // Fetch real images from Wikipedia API and setup scroll animations
            document.addEventListener("DOMContentLoaded", () => {
                // Scroll Animation Observer
                const observerOptions = {
                    root: null,
                    rootMargin: '0px',
                    threshold: 0.15
                };

                const cardObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        } else {
                            entry.target.classList.remove('visible');
                        }
                    });
                }, observerOptions);

                const birdCards = document.querySelectorAll('.bird-card');
                birdCards.forEach(card => cardObserver.observe(card));

                // Wikipedia API image fetching
                const birdImages = document.querySelectorAll('.bird-img');
                birdImages.forEach(img => {
                    const commonName = img.getAttribute('data-common-name');
                    const scientificName = img.getAttribute('data-scientific-name');
                    if (!commonName) return;

                    // Robust search function using Wikipedia's search generator
                    const fetchWikiImage = (searchQuery) => {
                        const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchQuery)}&gsrlimit=1&prop=pageimages&format=json&piprop=original&origin=*`;
                        return fetch(url)
                            .then(res => res.json())
                            .then(data => {
                                if (data && data.query && data.query.pages) {
                                    const pages = data.query.pages;
                                    const pageId = Object.keys(pages)[0];
                                    if (pageId !== "-1" && pages[pageId].original) {
                                        return pages[pageId].original.source;
                                    }
                                }
                                return null;
                            })
                            .catch(err => {
                                console.error("Wikipedia API error for " + searchQuery, err);
                                return null;
                            });
                    };

                    // Try common name first, fallback to scientific name
                    fetchWikiImage(commonName).then(imgUrl => {
                        if (imgUrl) {
                            img.src = imgUrl;
                        } else if (scientificName) {
                            fetchWikiImage(scientificName).then(fallbackImgUrl => {
                                if (fallbackImgUrl) {
                                    img.src = fallbackImgUrl;
                                }
                            });
                        }
                    });
                });
            });
        </script>
    </asp:Content>