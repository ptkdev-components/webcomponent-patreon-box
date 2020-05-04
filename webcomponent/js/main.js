/**
 * PatreonBox WebComponent
 * =====================
 * My Patreon Tier Box with avatars and link from rest/json api.
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: MIT License
 *
 */
class PatreonBox extends HTMLElement {
	constructor() {
		super();

		const template = document.createElement("template");
		template.innerHTML = `<style id="patreon-box-style">{% include 'css/main.css' %}</style>{% include 'main.html' %}`;

		this.attachShadow({mode: "open"});
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.json = null;
		this.options_default = {
			"api": "https://api.ptkdev.io/backers/",
			"items-limit": "100",
			"image-width": "100%",
			"image-height": "100%",
			"grid": "responsive",
			"cache": "enabled",
			"border-spacing": "2px",
			"border-corners": "5",
			"force-square": "yes"
		};

		this.options = Object.create(this.options_default);
	}

	/**
	 * Build HTML grid
	 * =====================
	 *
	 */
	build_html() {
		let data = this.json;

		let photos = [];

		for (let i=0; i<data.length; i++) {
			photos.push({
				url: data[i].url,
				pic: data[i].pic
			});
		}

		let html = "";
		for (let i = 0; i < photos.length && i < this.options["items-limit"]; i++) {
			html += `<li><a href="${photos[i].url}" rel="nofollow external noopener noreferrer" target="_blank" ><img width="${this.options["image-width"]}" height="${this.options["image-height"]}" src="${photos[i].pic}" alt="Backer" loading="lazy" /></a></li>`;
		}
		this.shadowRoot.querySelector(".patreon-box-backers").innerHTML = html;

		if (this.options["grid"] !== "" && this.options["grid"] !== null && this.options["grid"] !== "responsive") {
			let grid = this.options["grid"].split("x");
			let width = 100 / parseInt(grid[0]);
			let images = this.shadowRoot.querySelectorAll(".patreon-box-backers img");
			for (let i=0; i < images.length; i++) {
				images[i].removeAttribute("width");
				images[i].style.width = `calc(${(width)}% - (${this.options["border-spacing"]} * (${parseInt(grid[0])} * 2)))`;
				images[i].style.maxWidth = "none";
				images[i].style.maxHeight = "none";
				images[i].style.borderRadius = `${this.options["border-corners"]}%`;
				images[i].style.margin = this.options["border-spacing"];

				if (this.options["force-square"] === "yes") {
					images[i].removeAttribute("height");
					images[i].style.height = `${this.shadowRoot.querySelector(".patreon-box-backers img").clientWidth}px`;
				}
			}
		} else {
			let images = this.shadowRoot.querySelectorAll(".patreon-box-backers img");
			for (let i=0; i < images.length; i++) {
				images[i].style.borderRadius = `${this.options["border-corners"]}%`;
				images[i].style.margin = this.options["border-spacing"];

				if (this.options["force-square"] === "yes") {
					images[i].removeAttribute("height");
					images[i].style.maxHeight = "none";
					images[i].style.height = `${this.shadowRoot.querySelector(".patreon-box-backers img").clientWidth}px`;
				}
			}
		}
	}

	/**
	 * Fix responsive
	 * =====================
	 *
	 */
	resize() {
		let images = this.shadowRoot.querySelectorAll(".patreon-box-backers img");
		for (let i=0; i < images.length; i++) {
			if (this.options["force-square"] === "yes") {
				images[i].style.height = `${this.shadowRoot.querySelector(".patreon-box-backers img").clientWidth}px`;
			}
		}
	}

	/**
	 * Get Photos from fetch request
	 * =====================
	 *
	 */
	api_fetch() {
		fetch(this.options["api"], {"cache": this.options["cache"] === null || this.options["cache"] === "enabled" ? "force-cache" : "default"}).then(function(response) {
			if (response.status === 200) {
				return response.json();
			}
		}).then(function(response) {
			this.json = response;
			this.build_html();
			window.addEventListener("resize", function(event) {
				this.resize(event);
			}.bind(this));
		}.bind(this));
	}

	static get observedAttributes() {
		return ["api", "items-limit", "grid", "image-width", "image-height", "border-spacing", "border-corners", "force-square", "cache"];
	}

	attributeChangedCallback(name_attribute, old_vale, new_value) {
		if (old_vale !== new_value) {
			if (new_value === null || new_value === "") {
				this.options[name_attribute] = this.options_default[name_attribute];
			} else {
				this.options[name_attribute] = new_value;
			}

			switch (name_attribute) {
				case "api":
				  this.api_fetch();
				  break;
				default:
				  if (this.json !== null) {
						this.build_html();
				  }
			  }
		}
	}
}

window.customElements.define("patreon-box", PatreonBox);
