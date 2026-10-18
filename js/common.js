document.addEventListener("DOMContentLoaded", function() {
  'use strict';

  const cfg = window.HEXDUMP || {};

  const html = document.documentElement,
    body = document.body,
    menuToggle = document.querySelector(".hamburger"),
    navOverlay = document.getElementById("navOverlay"),
    navClose = document.querySelector(".nav-close"),
    themeDots = document.querySelectorAll(".theme-dot"),
    terminalPanel = document.querySelector(".terminal"),
    terminalOutput = document.getElementById("terminalOutput"),
    terminalInput = document.getElementById("terminalInput"),
    btnScrollToTop = document.querySelector(".top"),
    imagesOverlay = document.querySelector(".images-overlay");

  const VALID_THEMES = (cfg.themes && cfg.themes.length) ? cfg.themes : ["matrix", "dracula", "nord", "gruvbox", "mono"];

  const commandHistory = [];
  let historyPosition = -1;

  const h = {
    accent: function(t) { return `<span class="terminal__line--accent">${t}</span>`; },
    dim: function(t) { return `<span class="terminal__line--dim">${t}</span>`; },
    error: function(t) { return `<span class="terminal__line--error">${t}</span>`; },
    success: function(t) { return `<span class="terminal__line--success">${t}</span>`; },
    alt: function(t) { return `<span class="terminal__line--alt">${t}</span>`; },
    ascii: function(t) { return `<span class="terminal__line--ascii">${t}</span>`; },
    br: "<br>"
  };

  const COMMANDS = {
    help: function() {
      const commands = [
        ["about", "who am I"],
        ["contact", "contact info"],
        ["cat avatar.txt", "ASCII self-portrait"],
        ["skills", "skills with progress bars"],
        ["status", "availability for work"],
        ["theme <name>", "matrix | dracula | nord | gruvbox | mono"],
        ["sudo <anything>", "try it ;)"],
        ["history", "show command history"],
        ["clear", "clear terminal output"],
        ["↑ ↓", "navigate command history"],
        ["Tab", "autocomplete command"]
      ];

      const lines = commands.map(function(entry) {
        const label = entry[0].padEnd(19, " ").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return h.dim("  " + label) + "— " + entry[1];
      });

      return h.accent("Available commands:") + h.br + h.br + lines.join(h.br);
    },

    about: function() {
      const startDate = cfg.careerStart;
      const uptime = startDate ? calcUptime(startDate) : null;
      const careerLine = uptime ? h.dim("career:             ") + h.accent(uptime.totalDays + "d") + h.dim(` (since ${startDate})`) + h.br : "";
      const projectsLine = cfg.projectsCompleted ? h.dim("projects completed: ") + h.accent(String(cfg.projectsCompleted)) + h.br : "";
      const skillsStr = (cfg.skills || []).map(function(skill) {
        return h.accent(skill.name);
      }).join(" · ");

      return [
        h.dim("cat about.md") + h.br + h.br,
        cfg.aboutDescription ? cfg.aboutDescription + h.br + h.br : "",
        careerLine, projectsLine, h.br,
        skillsStr ? h.dim("skills: ") + skillsStr : ""
      ].join("");
    },

    contact: function() {
      const lines = [h.dim("cat contact.txt") + h.br + h.br];
      lines.push(h.dim("email:    ") + h.accent(cfg.email) + h.br);

      (cfg.social || []).forEach(function(item) {
        const label = (item.name + ":").padEnd(10, " ");
        lines.push(
          h.dim(label) +
          h.accent(item.link) +
          h.br
        );
      });

      return lines.join("");
    },

    skills: function() {
      const skillList = cfg.skills || [];

      if (!skillList.length) {
        return h.error("skills not found. Add skills to settings.yml");
      }

      return (
        h.dim("skills --list") + h.br + h.br +
        skillList.map(function(skill) {
          const percent = Math.max(0, Math.min(100, Number(skill.percent) || 0));
          const filled = Math.round(percent / 10);
          const bar = "[" + "█".repeat(filled) + "░".repeat(10 - filled) +"]";
          return (
            h.accent(bar) + " " + h.dim(percent + "%") + "  " + skill.name
          );
        }).join(h.br)
      );
    },

    status: function() {
      const statusLabels = {
        available: { icon: "🟢", text: "available for work", color: "success" },
        open_to_offers: { icon: "🟡", text: "open to offers", color: "alt" },
        busy: { icon: "🔴", text: "not available right now", color: "error" }
      };
      const status = statusLabels[cfg.authorStatus || "available"] || statusLabels["available"];

      return [
        h.dim("status --check") + h.br + h.br,
        `${status.icon}  ${h[status.color](status.text)}${h.br}${h.br}`,
        h.dim("response time: ") + h.accent("~24h") + h.br,
        h.dim("contact: ") + h.accent(cfg.email || "alex@hexdump.dev")
      ].join("");
    },

    cat: function(args) {
      const target = args[0] || "";

      if (target === "avatar.txt") {
        const avatarLines = (cfg.avatar || "(avatar not set)").split("\n").map(function(line) {
          return escapeHtml(line);
        }).join("\n");
        return h.ascii(avatarLines);
      }

      return h.error(`cat: ${escapeHtml(target)}: No such file or directory`) + h.br + h.dim("try: ") + h.accent("cat avatar.txt");
    },

    theme: function(args) {
      const themeName = (args[0] || "").toLowerCase();

      if (!themeName) return h.dim("current theme: ") + h.accent(html.getAttribute("data-theme")) + h.br + h.dim("available: ") + h.accent(VALID_THEMES.join(" | "));
      if (!VALID_THEMES.includes(themeName)) return h.error(`unknown theme: ${escapeHtml(themeName)}`) + h.br + h.dim("available: ") + h.accent(VALID_THEMES.join(" | "));
      if (cfg.switcherOff) return h.error("theme switching is disabled on this site");

      setTheme(themeName);
      return h.success("✓ theme set to: ") + h.accent(themeName);
    },

    rain: function() {
      return h.dim("rain command disabled.");
    },

    sudo: function() {
      return [
        h.error(`[sudo] password for ${cfg.author || "alex"}: `) + h.br + h.error("Sorry, try again.") + h.br,
        h.error(`${cfg.author || "alex"} is not in the sudoers file. This incident will be reported.${h.br}${h.br}`),
        h.dim("Just kidding. But seriously: ") + h.accent("nice try, hacker.") + h.br,
        h.ascii("\n( •_•) cool kids don't sudo rm -rf")
      ].join("");
    },

    pwd: function() {
      return h.accent(`/home/${cfg.author || "alex"}/portfolio`);
    },

    echo: function(args) {
      return escapeHtml(args.join(" "));
    },

    date: function() {
      return h.accent(new Date().toString());
    },

    history: function() {
      return commandHistory.length ? commandHistory.slice().reverse().map(function(cmd, i) {
        return h.dim(String(i + 1).padStart(3, " ") + "  ") + cmd;
      }).join(h.br) : h.dim("(empty)");
    },

    clear: null
  };


  /* =======================
  // Menu + Dropdowns
  ======================= */
  if (menuToggle) {
    menuToggle.addEventListener("click", function() {
      menu();
    });
  }

  if (navClose) {
    navClose.addEventListener("click", function() {
      menuClose();
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener("click", function(e) {
      if (e.target === navOverlay) menuClose();
    });
  }

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && navOverlay?.classList.contains("open")) {
      menuClose();
    }
  });

  document.querySelectorAll(".dropdown-toggle").forEach(function(toggle) {
    toggle.addEventListener("keydown", function(e) {
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        this.click();
      }
    });

    toggle.addEventListener("click", function() {
      dropdown(this);
    });
  });

  document.addEventListener("click", function(e) {
    if (!e.target.closest(".main-nav__item")) {
      dropdownClose();
    }
  });

  function menu() {
    const isOpen = navOverlay?.classList.contains("open");

    if (isOpen) {
      menuClose();
    } else {
      navOverlay?.classList.add("open");
      menuToggle.classList.add("is-open");
      body.classList.add("is-hidden");
    }
  }

  function menuClose() {
    navOverlay?.classList.remove("open");
    menuToggle?.classList.remove("is-open");
    body.classList.remove("is-hidden");
  }

  function dropdown(toggle) {
    document.querySelectorAll(".dropdown-menu").forEach(function(menu) {
      if (menu !== toggle.nextElementSibling) {
        menu.classList.remove("is-visible");
        body.classList.remove("is-hidden");

        const otherToggle = menu.previousElementSibling;
        if (otherToggle) {
          otherToggle.classList.remove("is-active");
          otherToggle.setAttribute("aria-expanded", "false");
        }
      }
    });

    toggle.classList.toggle("is-active");
    const isVisible = toggle.nextElementSibling.classList.toggle("is-visible");
    toggle.setAttribute("aria-expanded", isVisible ? "true" : "false");
  }

  function dropdownClose() {
    document.querySelectorAll(".dropdown-menu").forEach(function(menu) {
      menu.classList.remove("is-visible");

      const associatedToggle = menu.previousElementSibling;
      if (associatedToggle) {
        associatedToggle.classList.remove("is-active");
        associatedToggle.setAttribute("aria-expanded", "false");
      }
    });
  }


  /* =======================
  // Theme Switcher
  ======================= */
  initTheme();

  document.addEventListener("click", function(e) {
    const dot = e.target.closest(".theme-dot");

    if (dot?.dataset.theme) {
      setTheme(dot.dataset.theme);
    }
  });

  document.addEventListener("keydown", function(e) {
    if (e.key === "Enter" || e.key === " ") {
      const dot = e.target.closest(".theme-dot");
      if (dot?.dataset.theme) {
        e.preventDefault();
        setTheme(dot.dataset.theme);
      }
    }
  });

  function initTheme() {
    if (cfg.switcherOff) {
      try {
        localStorage.removeItem("hexdump-theme");
      } catch (e) {}

      setTheme(cfg.defaultTheme || "matrix");
      return;
    }

    let savedTheme = cfg.defaultTheme || "matrix";

    try {
      const stored = localStorage.getItem("hexdump-theme");
      if (stored && VALID_THEMES.includes(stored)) savedTheme = stored;
    } catch (e) {}

    setTheme(savedTheme);
  }

  function setTheme(name) {
    const validName = VALID_THEMES.includes(name) ? name : (cfg.defaultTheme || "matrix");

    html.setAttribute("data-theme", validName);

    themeDots.forEach(function(dot) {
      const isActive = dot.dataset.theme === validName;
      dot.classList.toggle("theme-dot--active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });

    if (!cfg.switcherOff) {
      try {
        localStorage.setItem("hexdump-theme", validName);
      } catch (e) {}
    }

    document.dispatchEvent(new CustomEvent("hexdump:theme-change", { detail: { theme: validName } }));
  }


  /* =======================
  // Terminal Engine
  ======================= */
  if (terminalInput) {
    terminalInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        const val = terminalInput.value.trim();
        if (val) execTerminalCommand(val);
        terminalInput.value = "";
        historyPosition = -1;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyPosition < commandHistory.length - 1) {
          historyPosition++;
          terminalInput.value = commandHistory[historyPosition];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyPosition > 0) {
          historyPosition--;
          terminalInput.value = commandHistory[historyPosition];
        } else {
          historyPosition = -1;
          terminalInput.value = "";
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        autocompleteTerminalCommand();
      }
    });
  }

  if (terminalPanel) {
    terminalPanel.addEventListener("click", function() {
      terminalInput?.focus();
    });
  }

  function execTerminalCommand(rawInput) {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    commandHistory.unshift(trimmed);
    historyPosition = -1;

    const parts = trimmed.split(/\s+/);
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmdName === "clear") {
      if (terminalOutput) terminalOutput.innerHTML = "";
      return;
    }

    const handler = COMMANDS[cmdName];
    let resultHtml = h.error(`command not found: ${escapeHtml(cmdName)}`) + h.br + h.dim("type ") + h.accent("help") + h.dim(" to see details");

    if (typeof handler === "function") {
      resultHtml = handler(args);
    }

    const promptHtml = `<span class="terminal__line--accent" style="font-weight:700">${cfg.author || "alex"}@${cfg.hostname || "hexdump"}</span> <span class="terminal__line--dim">~ $</span> ${escapeHtml(trimmed)}`;
    const block = document.createElement("div");
    block.className = "terminal__output-block";
    block.innerHTML = promptHtml + h.br + resultHtml;

    if (terminalOutput) {
      terminalOutput.appendChild(block);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  }

  function autocompleteTerminalCommand() {
    const partial = terminalInput.value.toLowerCase();
    if (!partial) return;

    const match = Object.keys(COMMANDS).find(function(name) {
      return name && COMMANDS[name] !== null && name.startsWith(partial);
    });

    if (match) terminalInput.value = match;
  }


  /* =======================
  // LazyLoad Images
  ======================= */
  lazyLoadImages();

  function lazyLoadImages() {
    if (typeof LazyLoad !== "undefined") {
      new LazyLoad({
        elements_selector: ".lazy"
      });
      return;
    }

    const lazyImages = document.querySelectorAll("img.lazy");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;

          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.addEventListener("load", function() {
              img.classList.add("lazy--loaded");
            }, { once: true });
          }

          observer.unobserve(img);
        });
      }, { rootMargin: "200px 0px" });

      lazyImages.forEach(function(img) {
        observer.observe(img);
      });
    }
  }


  /* =======================
  // Zoom Image
  ======================= */
  if (imagesOverlay) {
    const images = document.querySelectorAll('.post__content img, .page__content img, .project-content img, .gallery__image img');

    const clearOverlay = () => {
      imagesOverlay.classList.remove('active');
      imagesOverlay.innerHTML = '';
    };

    const createImageElement = (src) => {
      const img = document.createElement('img');
      img.src = src;
      return img;
    };

    const createDescriptionElement = (description) => {
      const descriptionElem = document.createElement('p');
      descriptionElem.textContent = description;
      descriptionElem.classList.add('image-overlay__description');
      return descriptionElem;
    };

    images.forEach(image => {
      image.addEventListener('click', () => {
        const galleryImage = image.closest('.gallery__image');
        const description = galleryImage?.querySelector('.gallery__image__caption')?.textContent || '';
        imagesOverlay.classList.add('active');

        imagesOverlay.innerHTML = '';
        imagesOverlay.appendChild(createImageElement(image.dataset.src || image.src));

        if (description) {
          imagesOverlay.appendChild(createDescriptionElement(description));
        }
      });
    });

    imagesOverlay.addEventListener('click', clearOverlay);
  }


  /* =======================
  // Slider Init
  ======================= */
  function initSlider(selector, options = {}) {
    const container = document.querySelector(selector);

    if (!container) return;

    return tns({
      container: selector,
      items: 3,
      slideBy: 1,
      gutter: 32,
      nav: true,
      mouseDrag: true,
      autoplay: false,
      speed: 500,
      responsive: {
        1024: {
          items: 3,
        },
        768: {
          items: 2,
        },
        0: {
          items: 1,
        }
      },
      ...options
    });
  }

  /* Testimonials */
  initSlider(".my-slider", {
    controlsContainer: "#customize-controls"
  });

  /* About */
  initSlider(".about-slider", {
    items: 1,
    gutter: 0,
    nav: true,
    controls: false,
    autoplay: true,
    speed: 800,
    autoplayTimeout: 5000,
    autoplayButtonOutput: false,
    responsive: false
  });


  /* =======================
  // Scroll Top Button
  ======================= */
  if (btnScrollToTop) {
    btnScrollToTop.addEventListener("click", function() {
      if (window.scrollY != 0) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth"
        })
      }
    });
  }


  /* =================================
  // Posts Page: Filters + Load More
  ================================= */
  const postList = document.querySelector(".post-list");

  if (postList) {
    const POSTS_PAGE_SIZE = cfg.postsPerPage || 6;
    const postItems = Array.prototype.slice.call(postList.querySelectorAll(".post-list__item"));
    const filterControls = document.querySelectorAll(".filter-control");
    const postsEmptyState = document.querySelector(".posts-page__empty");
    const loadMoreWrap = document.querySelector(".posts-page__load-more");
    const loadMoreButton = document.querySelector(".load-more-posts");

    let activePostsFilter = "all";
    let visiblePostsCount = POSTS_PAGE_SIZE;

    function getMatchingPosts() {
      return postItems.filter(function(item) {
        const tags = (item.getAttribute("data-tags") || "").split(",");
        return activePostsFilter === "all" || tags.indexOf(activePostsFilter) !== -1;
      });
    }

    function renderPosts() {
      const matching = getMatchingPosts();

      postItems.forEach(function(item) {
        item.classList.add("is-hidden");
      });

      matching.slice(0, visiblePostsCount).forEach(function(item) {
        item.classList.remove("is-hidden");
      });

      if (postsEmptyState) {
        postsEmptyState.classList.toggle("is-hidden", matching.length !== 0);
      }

      if (loadMoreWrap) {
        loadMoreWrap.classList.toggle("is-hidden", visiblePostsCount >= matching.length);
      }
    }

    filterControls.forEach(function(control) {
      control.addEventListener("click", function(e) {
        e.preventDefault();
        activePostsFilter = control.getAttribute("data-filter");
        visiblePostsCount = POSTS_PAGE_SIZE;

        filterControls.forEach(function(c) {
          c.classList.toggle("is-active", c.getAttribute("data-filter") === activePostsFilter);
        });

        renderPosts();
      });
    });

    if (loadMoreButton) {
      loadMoreButton.addEventListener("click", function(e) {
        e.preventDefault();
        visiblePostsCount += POSTS_PAGE_SIZE;
        renderPosts();
      });
    }

    renderPosts();
  }

  const postsSearchInput = document.getElementById("postsSearchInput");
  const postsSearchResults = document.getElementById("postsSearchResults");

  if (postsSearchInput && postsSearchResults && typeof SimpleJekyllSearch === "function") {
    SimpleJekyllSearch({
      searchInput: postsSearchInput,
      resultsContainer: postsSearchResults,
      json: cfg.searchJsonUrl || "/search.json",
      searchResultTemplate: `<li class="search-results-list__item"><a href="{url}" class="search-results-list__link">{title}</a></li>`,
      noResultsText: `<li class="search-results-list__item search-results-list__item--empty">No results found</li>`,
      limit: 8,
      fuzzy: false
    });
  }


  /* =======================
  // Tags Page
  ======================= */
  const tagGroups = document.querySelectorAll(".tags-page__group");
  const tagGroupHeads = document.querySelectorAll(".tags-page__group-head");
  const tagsIndex = document.getElementById("tagsIndex");
  const tagsIndexHead = document.getElementById("tagsIndexHead");

  if (tagGroups.length > 0) {
    const activeTagName = decodeURIComponent((window.location.search.split("tag=")[1] || "").split("&")[0]).toLowerCase();
    const activeElement = activeTagName ? document.getElementById(activeTagName) : null;
    const activeGroup = (activeElement && activeElement.classList.contains("tags-page__group")) ? activeElement : null;

    tagGroups.forEach(function(group) {
      group.classList.toggle("is-hidden", group !== activeGroup);
    });

    tagGroupHeads.forEach(function(head) {
      head.classList.toggle("is-hidden", head.getAttribute("data-tag-head") !== (activeGroup ? activeGroup.id : null));
    });

    if (tagsIndex) {
      tagsIndex.classList.toggle("is-hidden", !!activeGroup);
    }

    if (tagsIndexHead) {
      tagsIndexHead.classList.toggle("is-hidden", !!activeGroup);
    }

    tagGroups.forEach(function(group) {
      const head = document.querySelector('.tags-page__group-head[data-tag-head="' + group.id + '"]');
      const sortButton = head ? head.querySelector(".tags-page__sort") : null;
      const list = group.querySelector(".tags-page__list");

      if (sortButton && list) {
        sortButton.addEventListener("click", function() {
          const items = Array.prototype.slice.call(list.children);
          items.reverse().forEach(function(item) {
            list.appendChild(item);
          });

          const isNewest = sortButton.getAttribute("data-order") === "newest";
          sortButton.setAttribute("data-order", isNewest ? "oldest" : "newest");
          sortButton.textContent = "Sort by: " + (isNewest ? "Oldest" : "Newest");
        });
      }
    });
  }


  /* =================================
  // Projects Page: Filters + Sort
  ================================= */
  const projectsGrid = document.querySelector(".projects-page__grid");

  if (projectsGrid) {
    const projectCards = Array.prototype.slice.call(projectsGrid.querySelectorAll(".project-card"));
    const labelControls = document.querySelectorAll(".widget-project-labels .filter-control");
    const projectsEmptyState = document.querySelector(".projects-page__empty");
    const projectsSortButton = document.querySelector(".projects-page__sort");

    let activeLabelFilter = null;

    function renderProjects() {
      let visibleCount = 0;

      projectCards.forEach(function(card) {
        const labels = (card.getAttribute("data-labels") || "").split(",");
        const isVisible = !activeLabelFilter || labels.indexOf(activeLabelFilter) !== -1;
        card.classList.toggle("is-hidden", !isVisible);
        if (isVisible) visibleCount++;
      });

      if (projectsEmptyState) {
        projectsEmptyState.classList.toggle("is-hidden", visibleCount !== 0);
      }
    }

    labelControls.forEach(function(control) {
      control.addEventListener("click", function(e) {
        e.preventDefault();
        const filterValue = control.getAttribute("data-filter");
        activeLabelFilter = (activeLabelFilter === filterValue) ? null : filterValue;

        labelControls.forEach(function(c) {
          c.classList.toggle("is-active", c.getAttribute("data-filter") === activeLabelFilter);
        });

        renderProjects();
      });
    });

    if (projectsSortButton) {
      projectsSortButton.addEventListener("click", function() {
        const items = Array.prototype.slice.call(projectsGrid.children);
        items.reverse().forEach(function(item) {
          projectsGrid.appendChild(item);
        });

        const isNewest = projectsSortButton.getAttribute("data-order") === "newest";
        projectsSortButton.setAttribute("data-order", isNewest ? "oldest" : "newest");
        projectsSortButton.textContent = "Sort by: " + (isNewest ? "Oldest" : "Newest");
      });
    }
  }


  /* =============================
  // Post Page: Code Copy Buttons
  ============================= */
  const codeBlocks = document.querySelectorAll(".post__content .highlighter-rouge, .page__content .highlighter-rouge, .project-content .highlighter-rouge");

  codeBlocks.forEach(function(block) {
    const code = block.querySelector("code");
    if (!code) return;

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "code-copy";
    copyButton.textContent = "Copy";

    copyButton.addEventListener("click", function() {
      navigator.clipboard.writeText(code.textContent).then(function() {
        copyButton.textContent = "Copied";
        copyButton.classList.add("is-copied");

        setTimeout(function() {
          copyButton.textContent = "Copy";
          copyButton.classList.remove("is-copied");
        }, 2000);
      });
    });

    block.appendChild(copyButton);
  });


  /* =======================
  // Helpers
  ======================= */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function calcUptime(startDateStr) {
    const diffMs = Date.now() - new Date(startDateStr).getTime();
    const totalDays = Math.floor(diffMs / 86400000);
    const now = new Date();

    return {
      totalDays: totalDays,
      hours: now.getHours(),
      minutes: now.getMinutes()
    };
  }

  /* =======================
  // DevTools API
  ======================= */
  Object.assign(cfg, {
    terminal: { exec: execTerminalCommand },
    theme: { set: setTheme }
  });

});
