function Tabzy(selector, options = {}) {
    this.ul = document.querySelector(selector);

    if (!this.ul) {
        return console.error(`Tabzy: no ul found for selector '${selector}'`);
    };

    this.tabs = Array.from(this.ul.querySelectorAll('li a'));
    if (!this.tabs.length) {
        return console.error(`Tabzy: no tabs found inside the ul`);
    }

    this.contents = this.tabs.map(tab => {
        return document.querySelector(tab.getAttribute('href'))
            ? document.querySelector(tab.getAttribute('href'))
            : console.error(`Tabzy: no content found for selector ${tab.getAttribute('href')}`);
    }).filter(Boolean);

    if (this.contents.length !== this.tabs.length) {
        return;
    };

    this.originalHTML = this.ul.innerHTML;
    this.opt = Object.assign({
        remember: false,
    }, options);
    this._init();
}

Tabzy.prototype._init = function() {
    const hash = location.hash;
    console.log(hash)
    const tabToActive = (this.opt.remember && hash && this.tabs.find(tab => tab.getAttribute('href') === hash)) || this.tabs[0];

    this._activateTab(tabToActive);

    this.tabs.forEach(tab => {
        tab.onclick = (event) => {
            this._handleTabClick(event, tab);
        }
    });
}

Tabzy.prototype._handleTabClick = function(e, tab) {
    e.preventDefault();
    this._activateTab(tab);
}

Tabzy.prototype._activateTab = function(tab) {
    this.tabs.forEach(tab => {
        tab.closest('li').classList.remove('tabzy--active');
    })
    tab.closest('li').classList.add('tabzy--active');

    this.contents.forEach(content => content.hidden = true);
    const contentActive = document.querySelector(tab.getAttribute('href'));
    contentActive.hidden = false;

    if (this.opt.remember) {
        history.replaceState(null, null, tab.getAttribute('href'));
    }
}

// input: content selector (string) || tab element 
Tabzy.prototype.switch = function(input) {
    let tabActive = null;
    if (typeof input === 'string') {
        tabActive = this.tabs.find(tab => tab.getAttribute('href') === input);
    } else if (this.tabs.includes(input)) {
        tabActive = input;
    }

    if (!tabActive) {
        return console.error(`Invalid input ${input}`);
    }
    this._activateTab(tabActive);
};

Tabzy.prototype.destroy = function() {
    this.ul.innerHTML = this.originalHTML;
    this.contents.forEach(content => content.hidden = false);
    this.ul = null;
    this.tabs = null;
    this.contents = null;
}