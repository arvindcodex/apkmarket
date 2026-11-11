

        function onCardColorHover(el) {

            const cardImgId = el.getAttribute('data-card-img-id');

            const colorImg = el.getAttribute('data-color-img');

            const colorName = el.getAttribute('data-color-name');

            const hoverId = el.getAttribute('data-hover-id');



            if (cardImgId && colorImg) {

                const cardImg = document.getElementById(cardImgId);

                if (cardImg) {

                    if (!cardImg.dataset.originalSrc) {

                        cardImg.dataset.originalSrc = cardImg.src;

                    }

                    cardImg.src = colorImg;

                }

            }

            if (hoverId && colorName) {

                const hoverTxt = document.getElementById(hoverId);

                if (hoverTxt) {

                    hoverTxt.textContent = colorName;

                    hoverTxt.style.color = '#f472b6';

                }

            }

        }



        function onCardColorLeave(el) {

            const cardImgId = el.getAttribute('data-card-img-id');

            const defaultCountTxt = el.getAttribute('data-default-count-txt') || '';

            const hoverId = el.getAttribute('data-hover-id');



            if (cardImgId) {

                const cardImg = document.getElementById(cardImgId);

                if (cardImg && cardImg.dataset.originalSrc) {

                    cardImg.src = cardImg.dataset.originalSrc;

                }

            }

            if (hoverId) {

                const hoverTxt = document.getElementById(hoverId);

                if (hoverTxt) {

                    hoverTxt.textContent = defaultCountTxt;

                    hoverTxt.style.color = '#38bdf8';

                }

            }

        }



        function openTermsModal() {

            document.getElementById('termsModal').style.display = 'block';

        }



        function closeTermsModal() {

            document.getElementById('termsModal').style.display = 'none';

        }



        window.onclick = function(event) {

            var termsModal = document.getElementById('termsModal');

            if (event.target == termsModal) {

                termsModal.style.display = "none";

            }

            

            var detailsModal = document.getElementById('detailsModal');

            if (event.target == detailsModal) {

                closeDetails(event);

            }

            

            var univModal = document.getElementById('universalModal');

            if (event.target == univModal) {

                closeUniversal(event);

            }

        }

        

        function toggleTheme() {

            const body = document.body;

            const icon = document.getElementById('themeIcon');

            if (body.classList.contains('dark-theme')) {

                body.classList.remove('dark-theme');

                body.classList.add('light-theme');

                icon.className = 'fa-solid fa-sun';

                localStorage.setItem('theme', 'light');

            } else {

                body.classList.remove('light-theme');

                body.classList.add('dark-theme');

                icon.className = 'fa-solid fa-moon';

                localStorage.setItem('theme', 'dark');

            }

        }



        // Initialize Theme

        if (localStorage.getItem('theme') === 'light') {

            document.body.classList.remove('dark-theme');

            document.body.classList.add('light-theme');

            document.getElementById('themeIcon').className = 'fa-solid fa-sun';

        }



        function showToast(msg) {

            const toast = document.getElementById('toastMsg');

            toast.innerText = msg;

            toast.classList.add('show');

            setTimeout(() => {

                toast.classList.remove('show');

            }, 3000);

        }



        function switchUnivOption(val) {

            const predFields = document.getElementById('univPredictionFields');

            const fakeFields = document.getElementById('univFakesiteFields');

            const targetUrl = document.getElementById('univTargetUrl');

            const univPredAppName = document.getElementById('univPredAppName');

            const univAppLogo = document.getElementById('univAppLogo');

            const appName = document.getElementById('univAppName');

            const fontName = document.getElementById('univFontName');

            const platformId = document.getElementById('univPlatformId');



            if (val === 'prediction') {

                predFields.style.display = 'block';

                fakeFields.style.display = 'none';

                predFields.querySelectorAll('input, select, textarea').forEach(el => el.disabled = false);

                fakeFields.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);

                if (targetUrl) targetUrl.required = true;

                if (univPredAppName) univPredAppName.required = true;

                if (univAppLogo) univAppLogo.required = true;

                if (appName) appName.required = false;

                if (fontName) fontName.required = false;

                if (platformId) platformId.required = false;

            } else {

                predFields.style.display = 'none';

                fakeFields.style.display = 'block';

                predFields.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);

                fakeFields.querySelectorAll('input, select, textarea').forEach(el => el.disabled = false);

                if (targetUrl) targetUrl.required = false;

                if (univPredAppName) univPredAppName.required = false;

                if (univAppLogo) univAppLogo.required = false;

                if (appName) appName.required = true;

                if (fontName) fontName.required = true;

                if (platformId) platformId.required = true;

            }

        }



        window.currentUnivTemplate = null;



        window.selectUnivSitePlatform = function(elem) {

            const url = elem.getAttribute('data-site-url');

            const name = elem.getAttribute('data-site-name');

            const input = document.getElementById('univSelectedSiteValue');

            const badge = document.getElementById('univSelectedPlatformBadge');

            

            if (input) input.value = url;

            

            document.querySelectorAll('.univ-site-platform-card').forEach(card => {

                card.style.borderColor = 'var(--border-soft)';

                card.style.background = 'rgba(255, 255, 255, 0.03)';

                card.style.boxShadow = 'none';

                const txt = card.querySelector('.univ-platform-name-txt');

                if (txt) txt.style.color = 'var(--text-secondary)';

            });

            

            elem.style.borderColor = 'var(--primary, #6366f1)';

            elem.style.background = 'rgba(99, 102, 241, 0.12)';

            elem.style.boxShadow = '0 0 12px rgba(99, 102, 241, 0.35)';

            const activeTxt = elem.querySelector('.univ-platform-name-txt');

            if (activeTxt) activeTxt.style.color = '#fff';

            

            if (badge) {

                badge.style.background = 'rgba(16, 185, 129, 0.15)';

                badge.style.color = '#10b981';

                badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + name;

            }

        };



        function openDetails(tmpl, orderType) {
            window.currentUnivTemplate = tmpl;
            const uForm = document.getElementById('universalModalForm');
            if (uForm) uForm.reset();
            resetUnivLogoVerification();

            const uPrice = parseFloat(tmpl.price) || parseFloat(tmpl.univ_price) || 300;
            const modalTitle = document.getElementById('univModalTitle');
            if (modalTitle) modalTitle.innerText = tmpl.title || tmpl.name || tmpl.design_id || 'Custom APK Setup';

            const modalBadge = document.getElementById('univModalBadge');
            if (modalBadge) modalBadge.innerText = tmpl.design_id || 'APK BUILD';

            const modalPrice = document.getElementById('univModalPrice');
            if (modalPrice) modalPrice.innerText = '₹' + uPrice.toLocaleString('en-IN');

            const modalImg = document.getElementById('univModalImg');
            if (modalImg) modalImg.src = tmpl.image_url || '/assets/img/icon.png';

            const designIdInput = document.getElementById('univDesignId');
            if (designIdInput) designIdInput.value = tmpl.design_id || '';

            // Reset website input
            const webInput = document.getElementById('univWebsiteUrl');
            if (webInput) webInput.value = '';

            // Toggle Platform Selector for Universal Key
            const univSiteSec = document.getElementById('univPlatformSelectorSection');
            const univSiteInput = document.getElementById('univSelectedSiteValue');
            const univSiteBadge = document.getElementById('univSelectedPlatformBadge');
            if (univSiteSec && univSiteInput) {
                univSiteSec.style.display = 'block';
                univSiteInput.value = '';
                if (univSiteBadge) {
                    univSiteBadge.style.background = 'rgba(239, 68, 68, 0.15)';
                    univSiteBadge.style.color = '#ef4444';
                    univSiteBadge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Not Selected';
                }
                document.querySelectorAll('.univ-site-platform-card').forEach(c => {
                    c.style.borderColor = 'var(--border-soft)';
                    c.style.background = 'rgba(255, 255, 255, 0.03)';
                    c.style.boxShadow = 'none';
                    const txt = c.querySelector('.univ-platform-name-txt');
                    if (txt) txt.style.color = 'var(--text-secondary)';
                });
            }

            const optSelect = document.getElementById('univOptionSelect');
            if (optSelect) {
                optSelect.innerHTML = '<option value="prediction" selected>Complete APK Setup (₹' + uPrice.toLocaleString('en-IN') + ')</option>';
                optSelect.value = 'prediction';
            }
            if (typeof switchUnivOption === 'function') switchUnivOption('prediction');

            document.getElementById('universalModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeDetails(e) {

            if (e) e.preventDefault();

            document.getElementById('detailsModal').classList.remove('active');

            document.body.style.overflow = 'auto';

        }



        function closeUniversal(e) {

            if (e) e.preventDefault();

            document.getElementById('universalModal').classList.remove('active');

            document.body.style.overflow = 'auto';

        }

        // -------------------------------------------------------------
        // STOREFRONT CATEGORY FILTERING & URL SYNCHRONIZATION
        // -------------------------------------------------------------
        function filterByCategory(slug, btnEl) {
            slug = slug || 'all';

            // 1. Update chip buttons styling
            document.querySelectorAll('.category-filter-chip').forEach(function(chip) {
                chip.classList.remove('active');
                chip.style.borderColor = 'rgba(255,255,255,0.12)';
                chip.style.background = 'rgba(255,255,255,0.04)';
                chip.style.color = 'var(--text-secondary)';
                chip.style.boxShadow = 'none';
            });

            if (!btnEl && slug) {
                btnEl = document.querySelector('.category-filter-chip[data-cat="' + slug + '"]');
            }
            if (btnEl) {
                btnEl.classList.add('active');
                btnEl.style.borderColor = 'var(--acc, #38bdf8)';
                btnEl.style.background = 'rgba(56, 189, 248, 0.2)';
                btnEl.style.color = '#38bdf8';
                btnEl.style.boxShadow = '0 0 12px rgba(56, 189, 248, 0.3)';
            }

            // 2. Filter .tmpl-card elements
            const cards = document.querySelectorAll('.tmpl-card');
            let visibleCount = 0;
            cards.forEach(function(card) {
                const cat = card.getAttribute('data-category') || 'complete_setup';
                if (slug === 'all' || cat === slug) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // 3. Synchronize count in .section-count-badge
            const countBadge = document.querySelector('.section-count-badge span');
            if (countBadge) {
                const isUniv = (window.location.search.indexOf('type=universal') !== -1);
                countBadge.textContent = visibleCount + ' ' + (isUniv ? 'keys' : 'templates');
            }

            // 4. Synchronize URL query parameter without full reload
            if (window.history && window.history.replaceState) {
                try {
                    const currentUrl = new URL(window.location.href);
                    if (slug === 'all') {
                        currentUrl.searchParams.delete('cat');
                    } else {
                        currentUrl.searchParams.set('cat', slug);
                    }
                    window.history.replaceState({}, '', currentUrl.toString());
                } catch(e) {}
            }
        }

        // Initialize category filtering on load based on URL parameter
        document.addEventListener('DOMContentLoaded', function() {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const initialCat = urlParams.get('cat');
                if (initialCat) {
                    filterByCategory(initialCat);
                }
            } catch(e) {}
        });



        // Universal Key Image Verification Logic

        let isUnivLogoVerified = false;

        let verifiedUnivLogoUrl = '';

        let verifyUnivLogoAbortCtrl = null;



        function markUnivLogoVerified(url, format, width, height) {

            isUnivLogoVerified = true;

            verifiedUnivLogoUrl = url;



            const badge = document.getElementById('univLogoStatusBadge');

            const feedback = document.getElementById('univLogoFeedbackBox');

            const btn = document.getElementById('btnVerifyUnivLogo');



            if (badge) {

                badge.style.background = 'rgba(16, 185, 129, 0.15)';

                badge.style.color = '#10b981';

                badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Verified (${escapeHtmlUtil(format)})`;

            }



            if (feedback) {

                feedback.style.display = 'flex';

                feedback.style.alignItems = 'center';

                feedback.style.gap = '10px';

                feedback.style.background = 'rgba(16, 185, 129, 0.1)';

                feedback.style.border = '1px solid rgba(16, 185, 129, 0.3)';

                feedback.style.color = '#10b981';

                

                const dimText = (width && height) ? ` (${width}×${height})` : '';

                feedback.innerHTML = `

                    <img src="${escapeHtmlUtil(url)}" alt="Preview" style="width: 36px; height: 36px; object-fit: contain; border-radius: 6px; background: rgba(0,0,0,0.2); border: 1px solid rgba(16, 185, 129, 0.4); flex-shrink: 0;" onerror="this.style.display='none'">

                    <div>

                        <div style="font-weight: 600; color: #10b981;">✅ Image Verified!</div>

                        <div style="font-size: 11px; color: var(--text-secondary);">Format: <strong>${escapeHtmlUtil(format)}</strong>${dimText}</div>

                    </div>

                `;

            }



            if (btn) {

                btn.disabled = false;

                btn.style.background = '#10b981';

                btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Verified</span>';

            }

        }



        function markUnivLogoFailed(errorMsg) {

            isUnivLogoVerified = false;

            verifiedUnivLogoUrl = '';



            const badge = document.getElementById('univLogoStatusBadge');

            const feedback = document.getElementById('univLogoFeedbackBox');

            const btn = document.getElementById('btnVerifyUnivLogo');



            if (badge) {

                badge.style.background = 'rgba(239, 68, 68, 0.15)';

                badge.style.color = '#ef4444';

                badge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Invalid Link';

            }



            if (feedback) {

                feedback.style.display = 'block';

                feedback.style.background = 'rgba(239, 68, 68, 0.1)';

                feedback.style.border = '1px solid rgba(239, 68, 68, 0.3)';

                feedback.style.color = '#ef4444';

                feedback.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="margin-right:6px;"></i> <strong>Verification Failed:</strong> ${escapeHtmlUtil(errorMsg)}`;

            }



            if (btn) {

                btn.disabled = false;

                btn.style.background = 'var(--primary, #6366f1)';

                btn.innerHTML = '<i class="fa-solid fa-shield-check"></i> <span>Re-Verify</span>';

            }

        }



        function resetUnivLogoVerification() {

            isUnivLogoVerified = false;

            verifiedUnivLogoUrl = '';

            const badge = document.getElementById('univLogoStatusBadge');

            const feedback = document.getElementById('univLogoFeedbackBox');

            const btn = document.getElementById('btnVerifyUnivLogo');

            if (badge) {

                badge.style.background = 'rgba(239, 68, 68, 0.15)';

                badge.style.color = '#ef4444';

                badge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Not Verified';

            }

            if (feedback) {

                feedback.style.display = 'none';

                feedback.innerHTML = '';

            }

            if (btn) {

                btn.disabled = false;

                btn.style.background = 'var(--primary, #6366f1)';

                btn.innerHTML = '<i class="fa-solid fa-shield-check"></i> <span>Verify Image</span>';

            }

        }



        function handleUnivLogoUrlChange() {

            const input = document.getElementById('univAppLogo');

            if (!input) return;

            const currentUrl = input.value.trim();

            const badge = document.getElementById('univLogoStatusBadge');

            const feedback = document.getElementById('univLogoFeedbackBox');

            const btn = document.getElementById('btnVerifyUnivLogo');



            if (!currentUrl) {

                resetUnivLogoVerification();

                return;

            }



            if (currentUrl !== verifiedUnivLogoUrl) {

                isUnivLogoVerified = false;

                if (badge) {

                    badge.style.background = 'rgba(245, 158, 11, 0.15)';

                    badge.style.color = '#f59e0b';

                    badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Needs Verification';

                }

                if (feedback) {

                    feedback.style.display = 'block';

                    feedback.style.background = 'rgba(245, 158, 11, 0.1)';

                    feedback.style.border = '1px solid rgba(245, 158, 11, 0.3)';

                    feedback.style.color = '#f59e0b';

                    feedback.innerHTML = '<i class="fa-solid fa-circle-info"></i> Image link changed. Please click <strong>Verify Image</strong> to validate.';

                }

                if (btn) {

                    btn.style.background = 'var(--primary, #6366f1)';

                    btn.innerHTML = '<i class="fa-solid fa-shield-check"></i> <span>Verify Image</span>';

                }

            }

        }



        async function verifyUnivLogo() {

            const input = document.getElementById('univAppLogo');

            const badge = document.getElementById('univLogoStatusBadge');

            const feedback = document.getElementById('univLogoFeedbackBox');

            const btn = document.getElementById('btnVerifyUnivLogo');

            const url = input.value.trim();



            if (!url) {

                if (badge) {

                    badge.style.background = 'rgba(239, 68, 68, 0.15)';

                    badge.style.color = '#ef4444';

                    badge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Missing URL';

                }

                if (feedback) {

                    feedback.style.display = 'block';

                    feedback.style.background = 'rgba(239, 68, 68, 0.1)';

                    feedback.style.border = '1px solid rgba(239, 68, 68, 0.3)';

                    feedback.style.color = '#ef4444';

                    feedback.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Please paste a direct image URL first.';

                }

                input.focus();

                return;

            }



            // Quick check for ibb.co viewer link

            if (/^https?:\/\/(www\.)?ibb\.co\/[a-zA-Z0-9]+$/i.test(url)) {

                markUnivLogoFailed('This is an ImgBB webpage link (ibb.co), NOT a direct image. Please copy the direct image link (e.g. https://i.ibb.co/.../image.png).');

                return;

            }



            // Abort previous in-flight request if any

            if (verifyUnivLogoAbortCtrl) {

                try { verifyUnivLogoAbortCtrl.abort(); } catch(e) {}

            }

            verifyUnivLogoAbortCtrl = new AbortController();



            btn.disabled = true;

            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Checking...</span>';

            if (badge) {

                badge.style.background = 'rgba(99, 102, 241, 0.15)';

                badge.style.color = '#6366f1';

                badge.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Checking...';

            }

            if (feedback) {

                feedback.style.display = 'block';

                feedback.style.background = 'rgba(99, 102, 241, 0.08)';

                feedback.style.border = '1px solid rgba(99, 102, 241, 0.2)';

                feedback.style.color = 'var(--text-primary, #ffffff)';

                feedback.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right:6px;"></i> Testing image accessibility and format...';

            }



            let isResolved = false;



            // 1. INSTANT CLIENT-SIDE IMAGE PROBE (Fires in 50-200ms!)

            const clientTest = new Image();

            clientTest.onload = function() {

                if (!isResolved && clientTest.naturalWidth > 0) {

                    isResolved = true;

                    let fmt = 'IMAGE';

                    const cleanUrl = url.split('?')[0].toLowerCase();

                    if (cleanUrl.endsWith('.png')) fmt = 'PNG';

                    else if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) fmt = 'JPEG';

                    else if (cleanUrl.endsWith('.webp')) fmt = 'WEBP';

                    else if (cleanUrl.endsWith('.svg')) fmt = 'SVG';

                    else if (cleanUrl.endsWith('.gif')) fmt = 'GIF';



                    markUnivLogoVerified(url, fmt, clientTest.naturalWidth, clientTest.naturalHeight);

                }

            };

            clientTest.onerror = function() {

                // Let server check decide

            };

            clientTest.src = url;



            // 2. PARALLEL SERVER-SIDE VERIFICATION WITH TIMEOUT (5s max)

            try {

                const timeoutId = setTimeout(() => {

                    if (verifyUnivLogoAbortCtrl) {

                        try { verifyUnivLogoAbortCtrl.abort(); } catch(e) {}

                    }

                }, 5000);



                const res = await fetch('verify_image.php?url=' + encodeURIComponent(url), {

                    signal: verifyUnivLogoAbortCtrl.signal

                });

                clearTimeout(timeoutId);



                const data = await res.json();



                if (data.success) {

                    if (!isResolved) {

                        isResolved = true;

                        markUnivLogoVerified(url, data.format || 'IMAGE', data.width, data.height);

                    }

                } else {

                    if (!isResolved) {

                        if (clientTest.naturalWidth > 0) {

                            isResolved = true;

                            markUnivLogoVerified(url, 'IMAGE', clientTest.naturalWidth, clientTest.naturalHeight);

                        } else {

                            isResolved = true;

                            markUnivLogoFailed(data.error || 'Invalid or unreachable image.');

                        }

                    }

                }

            } catch (err) {

                if (!isResolved) {

                    if (clientTest.naturalWidth > 0) {

                        isResolved = true;

                        markUnivLogoVerified(url, 'IMAGE', clientTest.naturalWidth, clientTest.naturalHeight);

                    } else {

                        isResolved = true;

                        const errMsg = (err.name === 'AbortError')

                            ? 'Verification timed out. Please check your image URL and try again.'

                            : 'Network error while verifying image. Please try again.';

                        markUnivLogoFailed(errMsg);

                    }

                }

            } finally {

                setTimeout(() => {

                    const b = document.getElementById('btnVerifyUnivLogo');

                    if (b && b.innerHTML.indexOf('Checking...') !== -1) {

                        b.disabled = false;

                        if (isUnivLogoVerified) {

                            b.innerHTML = '<i class="fa-solid fa-check"></i> <span>Verified</span>';

                            b.style.background = '#10b981';

                        } else {

                            b.innerHTML = '<i class="fa-solid fa-shield-check"></i> <span>Verify Image</span>';

                            b.style.background = 'var(--primary, #6366f1)';

                        }

                    }

                }, 800);

                return isUnivLogoVerified;

            }

        }



        window.verifyUnivLogo = verifyUnivLogo;

        window.markUnivLogoVerified = markUnivLogoVerified;

        window.markUnivLogoFailed = markUnivLogoFailed;

        window.handleUnivLogoUrlChange = handleUnivLogoUrlChange;

        window.openDetails = openDetails;

        window.closeDetails = closeDetails;

        window.closeUniversal = closeUniversal;

        window.switchUnivOption = switchUnivOption;



        function escapeHtmlUtil(text) {

            if (!text) return '';

            return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

        }



        // Intercept Universal Key Form submission with seamless auto-verify (NO CHECKOUT WITHOUT VERIFIED IMAGE!)

        const uModalForm = document.getElementById('universalModalForm');

        let isUnivSubmitting = false;

        if (uModalForm) {

            uModalForm.addEventListener('submit', async function(e) {

                if (isUnivSubmitting) return;



                // Validate Platform Selection if required

                if (window.currentUnivTemplate && parseInt(window.currentUnivTemplate.has_site_selector) === 1) {

                    const siteInput = document.getElementById('univSelectedSiteValue');

                    if (!siteInput || !siteInput.value || siteInput.value.trim() === '') {

                        e.preventDefault();

                        alert("Please select a Platform Name from 'Select Platform Name' before proceeding.");

                        document.getElementById('univPlatformSelectorSection')?.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        return false;

                    }

                }



                const opt = document.getElementById('univOptionSelect').value;

                if (opt === 'prediction') {

                    const logoInput = document.getElementById('univAppLogo');

                    const logoVal = logoInput ? logoInput.value.trim() : '';

                    if (!logoVal) {

                        e.preventDefault();

                        alert("Please enter and verify your App Logo link before proceeding.");

                        if (logoInput) logoInput.focus();

                        return false;

                    }



                    if (!isUnivLogoVerified || logoVal !== verifiedUnivLogoUrl) {

                        e.preventDefault();

                        const submitBtn = this.querySelector('button[type="submit"]');

                        const origText = submitBtn ? submitBtn.innerHTML : '';

                        if (submitBtn) {

                            submitBtn.disabled = true;

                            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying Image Before Checkout...';

                        }



                        const ok = await verifyUnivLogo();



                        if (submitBtn) {

                            submitBtn.disabled = false;

                            submitBtn.innerHTML = origText;

                        }



                        if (ok && isUnivLogoVerified && logoVal === verifiedUnivLogoUrl) {

                            if (window.currentUnivTemplate && parseInt(window.currentUnivTemplate.has_site_selector) === 1) {

                                const siteInput = document.getElementById('univSelectedSiteValue');

                                if (!siteInput || !siteInput.value || siteInput.value.trim() === '') {

                                    alert("Please select a Platform Name from 'Select Platform Name' before proceeding.");

                                    document.getElementById('univPlatformSelectorSection')?.scrollIntoView({ behavior: 'smooth', block: 'center' });

                                    return false;

                                }

                            }

                            isUnivSubmitting = true;
                            e.preventDefault();
                            
                            const webUrl = document.getElementById('univWebsiteUrl')?.value || '';
                            const appName = document.getElementById('univPredAppName')?.value || '';
                            const appLogo = document.getElementById('univAppLogo')?.value || '';
                            const designId = document.getElementById('univDesignId')?.value || (window.currentUnivTemplate ? window.currentUnivTemplate.design_id : '');
                            const siteVal = document.getElementById('univSelectedSiteValue')?.value || '';
                            const price = window.currentUnivTemplate ? (window.currentUnivTemplate.price || window.currentUnivTemplate.univ_price || 300) : 300;

                            const targetUrl = 'order.php?design_id=' + encodeURIComponent(designId)
                                            + '&website_url=' + encodeURIComponent(webUrl)
                                            + '&app_name=' + encodeURIComponent(appName)
                                            + '&app_logo=' + encodeURIComponent(appLogo)
                                            + '&platform=' + encodeURIComponent(siteVal)
                                            + '&price=' + encodeURIComponent(price);

                            window.location.href = targetUrl;
                            return false;

                        } else {

                            alert("⚠️ Image verification failed. Please check your image URL (PNG, JPG, etc.) and verify it before ordering.");

                            if (logoInput) {

                                logoInput.focus();

                                logoInput.scrollIntoView({ behavior: 'smooth', block: 'center' });

                            }

                            return false;

                        }

                    }

                }

            });

        }



        document.addEventListener('DOMContentLoaded', function() {

            const uBtn = document.getElementById('btnVerifyUnivLogo');

            if (uBtn) {

                uBtn.addEventListener('click', function(e) {

                    e.preventDefault();

                    verifyUnivLogo();

                });

                uBtn.addEventListener('touchend', function(e) {

                    e.preventDefault();

                    verifyUnivLogo();

                });

            }

        });

    
// Auth State Management
function updateAuthState() {
    try {
        const rawUser = localStorage.getItem("apkmarket_user");
        const walletChips = document.querySelectorAll(".wallet-chip");
        const navLoginLinks = document.querySelectorAll('a[href="login.php"].nav-item');

        if (rawUser) {
            const user = JSON.parse(rawUser);
            const displayName = user.telegram_id || user.identifier || user.name || "User";

            walletChips.forEach(chip => {
                chip.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981; margin-right: 4px;"></i> <span>${escapeHtmlUtil(displayName)}</span>`;
                chip.title = "Click to Logout";
                chip.onclick = function(e) {
                    e.preventDefault();
                    if (confirm("Logout from " + displayName + "?")) {
                        localStorage.removeItem("apkmarket_user");
                        showToast("Logged out successfully");
                        updateAuthState();
                    }
                };
            });

            navLoginLinks.forEach(link => {
                const label = link.querySelector("span");
                if (label) label.textContent = "Profile";
                const icon = link.querySelector("i");
                if (icon) icon.className = "fa-solid fa-user-check";
                link.onclick = function(e) {
                    e.preventDefault();
                    if (confirm("You are logged in as " + displayName + ". Logout?")) {
                        localStorage.removeItem("apkmarket_user");
                        showToast("Logged out");
                        updateAuthState();
                    }
                };
            });
        } else {
            walletChips.forEach(chip => {
                chip.innerHTML = "Login";
                chip.title = "Sign In or Skip Login";
                chip.onclick = null;
            });
            navLoginLinks.forEach(link => {
                const label = link.querySelector("span");
                if (label) label.textContent = "Login";
                const icon = link.querySelector("i");
                if (icon) icon.className = "fa-solid fa-user";
                link.onclick = null;
            });
        }
    } catch(e) {
        console.error(e);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateAuthState);
} else {
    updateAuthState();
}
