//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, a) => (a = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule ? t(a, "default", {
	value: n,
	enumerable: !0
}) : a, n)), l = "/node/api/user", u = `${l}/login`, d = "JUMP_LOGIN_EVENT", f = new AbortController(), p = () => f.signal, m = () => {
	f.abort(), f = new AbortController();
}, h = () => {
	let e = XMLHttpRequest.prototype.open, t = XMLHttpRequest.prototype.send;
	XMLHttpRequest.prototype.open = function(t, n, ...r) {
		return this._method = t, this._url = n, e.apply(this, [
			t,
			n,
			...r
		]);
	}, XMLHttpRequest.prototype.send = function(...e) {
		return p().addEventListener("abort", () => {
			console.log("XHR aborted", this), this.abort();
		}, { once: !0 }), this.addEventListener("readystatechange", function() {
			this.readyState === XMLHttpRequest.DONE && (console.log(`[XHR] ${this._method} ${this._url}, ${this.status}, ${this.response?.status}, ${this.response?.message}`), this.status === 401 && (console.log("[XHR] status 401 detected"), m(), window.dispatchEvent(new Event(d))), this.response?.status === 401 && (console.log("[XHR] code 401 detected"), m(), window.dispatchEvent(new Event(d))));
		}), t.apply(this, e);
	};
}, g = () => {
	let e = window.fetch;
	window.fetch = function(t, n) {
		return new Promise((r, i) => {
			e.apply(this, [t, {
				...n,
				signal: p()
			}]).then(async (e) => {
				if (e.status === 401 && (console.log("[Fetch] status 401 detected"), m(), window.dispatchEvent(new Event(d))), e.status === 200) {
					if (e.headers.get("Content-Type")?.includes("application/json")) try {
						if ((await e.clone().json()).status === 401) return console.log("[Fetch] code 401 detected"), m(), window.dispatchEvent(new Event(d)), i(/* @__PURE__ */ Error("Fetch response is 401"));
					} catch (e) {
						console.warn("Fetch response is not json", e);
					}
					return r(e);
				}
				return i(/* @__PURE__ */ Error("Fetch response is not 200"));
			}).catch((e) => (console.log("error", e), e.name === "AbortError" ? (console.log("Fetch aborted"), i(/* @__PURE__ */ Error("Fetch aborted"))) : i(e)));
		});
	};
}, _ = () => {
	h(), g();
}, v = () => new Promise((e, t) => {
	fetch(l).then((e) => e.json()).then((t) => (console.log("User data:", t), e(t))).catch((e) => (console.log("Failed to fetch user:", e), t(e)));
}), y = (e, t) => new Promise((n, r) => {
	fetch(u, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			username: e,
			password: t,
			gatewayToken: !0
		})
	}).then((e) => e.json()).then((e) => (console.log("Login successful:", e), n(e))).catch((e) => (console.error("Login failed:", e), r(e)));
}), b = window, x = b.cefQuery, S = b.QBbrowser, C = () => !!x;
S && new b.QBbrowser();
var w = (e, t, n, r) => {
	C() && x && x({
		request: t,
		onSuccess: n || function(e) {
			console.info(e);
		},
		onFailure: r || function(t, n) {
			console.info(e + " : " + n);
		}
	});
}, T = (e, t) => {
	w("getUser", "[\"req_cache\",[{\"data\":\"UserInfo\"}]]", (t) => {
		let n = JSON.parse(t);
		e({
			...n,
			id: n.UserId,
			username: n.UserAccount,
			password: n.Password
		});
	}, t);
}, E = /* @__PURE__ */ o(((e, t) => {
	(function() {
		var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = {
			rotl: function(e, t) {
				return e << t | e >>> 32 - t;
			},
			rotr: function(e, t) {
				return e << 32 - t | e >>> t;
			},
			endian: function(e) {
				if (e.constructor == Number) return n.rotl(e, 8) & 16711935 | n.rotl(e, 24) & 4278255360;
				for (var t = 0; t < e.length; t++) e[t] = n.endian(e[t]);
				return e;
			},
			randomBytes: function(e) {
				for (var t = []; e > 0; e--) t.push(Math.floor(Math.random() * 256));
				return t;
			},
			bytesToWords: function(e) {
				for (var t = [], n = 0, r = 0; n < e.length; n++, r += 8) t[r >>> 5] |= e[n] << 24 - r % 32;
				return t;
			},
			wordsToBytes: function(e) {
				for (var t = [], n = 0; n < e.length * 32; n += 8) t.push(e[n >>> 5] >>> 24 - n % 32 & 255);
				return t;
			},
			bytesToHex: function(e) {
				for (var t = [], n = 0; n < e.length; n++) t.push((e[n] >>> 4).toString(16)), t.push((e[n] & 15).toString(16));
				return t.join("");
			},
			hexToBytes: function(e) {
				for (var t = [], n = 0; n < e.length; n += 2) t.push(parseInt(e.substr(n, 2), 16));
				return t;
			},
			bytesToBase64: function(t) {
				for (var n = [], r = 0; r < t.length; r += 3) for (var i = t[r] << 16 | t[r + 1] << 8 | t[r + 2], a = 0; a < 4; a++) r * 8 + a * 6 <= t.length * 8 ? n.push(e.charAt(i >>> 6 * (3 - a) & 63)) : n.push("=");
				return n.join("");
			},
			base64ToBytes: function(t) {
				t = t.replace(/[^A-Z0-9+\/]/gi, "");
				for (var n = [], r = 0, i = 0; r < t.length; i = ++r % 4) i != 0 && n.push((e.indexOf(t.charAt(r - 1)) & 2 ** (-2 * i + 8) - 1) << i * 2 | e.indexOf(t.charAt(r)) >>> 6 - i * 2);
				return n;
			}
		};
		t.exports = n;
	})();
})), D = /* @__PURE__ */ o(((e, t) => {
	var n = {
		utf8: {
			stringToBytes: function(e) {
				return n.bin.stringToBytes(unescape(encodeURIComponent(e)));
			},
			bytesToString: function(e) {
				return decodeURIComponent(escape(n.bin.bytesToString(e)));
			}
		},
		bin: {
			stringToBytes: function(e) {
				for (var t = [], n = 0; n < e.length; n++) t.push(e.charCodeAt(n) & 255);
				return t;
			},
			bytesToString: function(e) {
				for (var t = [], n = 0; n < e.length; n++) t.push(String.fromCharCode(e[n]));
				return t.join("");
			}
		}
	};
	t.exports = n;
})), O = /* @__PURE__ */ o(((e, t) => {
	t.exports = function(e) {
		return e != null && (n(e) || r(e) || !!e._isBuffer);
	};
	function n(e) {
		return !!e.constructor && typeof e.constructor.isBuffer == "function" && e.constructor.isBuffer(e);
	}
	function r(e) {
		return typeof e.readFloatLE == "function" && typeof e.slice == "function" && n(e.slice(0, 0));
	}
})), k = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t) => {
	(function() {
		var e = E(), n = D().utf8, r = O(), i = D().bin, a = function(t, o) {
			t.constructor == String ? t = o && o.encoding === "binary" ? i.stringToBytes(t) : n.stringToBytes(t) : r(t) ? t = Array.prototype.slice.call(t, 0) : !Array.isArray(t) && t.constructor !== Uint8Array && (t = t.toString());
			for (var s = e.bytesToWords(t), c = t.length * 8, l = 1732584193, u = -271733879, d = -1732584194, f = 271733878, p = 0; p < s.length; p++) s[p] = (s[p] << 8 | s[p] >>> 24) & 16711935 | (s[p] << 24 | s[p] >>> 8) & 4278255360;
			s[c >>> 5] |= 128 << c % 32, s[(c + 64 >>> 9 << 4) + 14] = c;
			for (var m = a._ff, h = a._gg, g = a._hh, _ = a._ii, p = 0; p < s.length; p += 16) {
				var v = l, y = u, b = d, x = f;
				l = m(l, u, d, f, s[p + 0], 7, -680876936), f = m(f, l, u, d, s[p + 1], 12, -389564586), d = m(d, f, l, u, s[p + 2], 17, 606105819), u = m(u, d, f, l, s[p + 3], 22, -1044525330), l = m(l, u, d, f, s[p + 4], 7, -176418897), f = m(f, l, u, d, s[p + 5], 12, 1200080426), d = m(d, f, l, u, s[p + 6], 17, -1473231341), u = m(u, d, f, l, s[p + 7], 22, -45705983), l = m(l, u, d, f, s[p + 8], 7, 1770035416), f = m(f, l, u, d, s[p + 9], 12, -1958414417), d = m(d, f, l, u, s[p + 10], 17, -42063), u = m(u, d, f, l, s[p + 11], 22, -1990404162), l = m(l, u, d, f, s[p + 12], 7, 1804603682), f = m(f, l, u, d, s[p + 13], 12, -40341101), d = m(d, f, l, u, s[p + 14], 17, -1502002290), u = m(u, d, f, l, s[p + 15], 22, 1236535329), l = h(l, u, d, f, s[p + 1], 5, -165796510), f = h(f, l, u, d, s[p + 6], 9, -1069501632), d = h(d, f, l, u, s[p + 11], 14, 643717713), u = h(u, d, f, l, s[p + 0], 20, -373897302), l = h(l, u, d, f, s[p + 5], 5, -701558691), f = h(f, l, u, d, s[p + 10], 9, 38016083), d = h(d, f, l, u, s[p + 15], 14, -660478335), u = h(u, d, f, l, s[p + 4], 20, -405537848), l = h(l, u, d, f, s[p + 9], 5, 568446438), f = h(f, l, u, d, s[p + 14], 9, -1019803690), d = h(d, f, l, u, s[p + 3], 14, -187363961), u = h(u, d, f, l, s[p + 8], 20, 1163531501), l = h(l, u, d, f, s[p + 13], 5, -1444681467), f = h(f, l, u, d, s[p + 2], 9, -51403784), d = h(d, f, l, u, s[p + 7], 14, 1735328473), u = h(u, d, f, l, s[p + 12], 20, -1926607734), l = g(l, u, d, f, s[p + 5], 4, -378558), f = g(f, l, u, d, s[p + 8], 11, -2022574463), d = g(d, f, l, u, s[p + 11], 16, 1839030562), u = g(u, d, f, l, s[p + 14], 23, -35309556), l = g(l, u, d, f, s[p + 1], 4, -1530992060), f = g(f, l, u, d, s[p + 4], 11, 1272893353), d = g(d, f, l, u, s[p + 7], 16, -155497632), u = g(u, d, f, l, s[p + 10], 23, -1094730640), l = g(l, u, d, f, s[p + 13], 4, 681279174), f = g(f, l, u, d, s[p + 0], 11, -358537222), d = g(d, f, l, u, s[p + 3], 16, -722521979), u = g(u, d, f, l, s[p + 6], 23, 76029189), l = g(l, u, d, f, s[p + 9], 4, -640364487), f = g(f, l, u, d, s[p + 12], 11, -421815835), d = g(d, f, l, u, s[p + 15], 16, 530742520), u = g(u, d, f, l, s[p + 2], 23, -995338651), l = _(l, u, d, f, s[p + 0], 6, -198630844), f = _(f, l, u, d, s[p + 7], 10, 1126891415), d = _(d, f, l, u, s[p + 14], 15, -1416354905), u = _(u, d, f, l, s[p + 5], 21, -57434055), l = _(l, u, d, f, s[p + 12], 6, 1700485571), f = _(f, l, u, d, s[p + 3], 10, -1894986606), d = _(d, f, l, u, s[p + 10], 15, -1051523), u = _(u, d, f, l, s[p + 1], 21, -2054922799), l = _(l, u, d, f, s[p + 8], 6, 1873313359), f = _(f, l, u, d, s[p + 15], 10, -30611744), d = _(d, f, l, u, s[p + 6], 15, -1560198380), u = _(u, d, f, l, s[p + 13], 21, 1309151649), l = _(l, u, d, f, s[p + 4], 6, -145523070), f = _(f, l, u, d, s[p + 11], 10, -1120210379), d = _(d, f, l, u, s[p + 2], 15, 718787259), u = _(u, d, f, l, s[p + 9], 21, -343485551), l = l + v >>> 0, u = u + y >>> 0, d = d + b >>> 0, f = f + x >>> 0;
			}
			return e.endian([
				l,
				u,
				d,
				f
			]);
		};
		a._ff = function(e, t, n, r, i, a, o) {
			var s = e + (t & n | ~t & r) + (i >>> 0) + o;
			return (s << a | s >>> 32 - a) + t;
		}, a._gg = function(e, t, n, r, i, a, o) {
			var s = e + (t & r | n & ~r) + (i >>> 0) + o;
			return (s << a | s >>> 32 - a) + t;
		}, a._hh = function(e, t, n, r, i, a, o) {
			var s = e + (t ^ n ^ r) + (i >>> 0) + o;
			return (s << a | s >>> 32 - a) + t;
		}, a._ii = function(e, t, n, r, i, a, o) {
			var s = e + (n ^ (t | ~r)) + (i >>> 0) + o;
			return (s << a | s >>> 32 - a) + t;
		}, a._blocksize = 16, a._digestsize = 16, t.exports = function(t, n) {
			if (t == null) throw Error("Illegal argument " + t);
			var r = e.wordsToBytes(a(t, n));
			return n && n.asBytes ? r : n && n.asString ? i.bytesToString(r) : e.bytesToHex(r);
		};
	})();
})))(), 1), A = "<dialog\n  id=\"auth-dialog\"\n  class=\"auth-dialog\"\n>\n  <form method=\"dialog\">\n    <p>\n      <input placeholder=\"Username\" type=\"text\" id=\"username\" name=\"username\" autocomplete=\"username\" required>\n    </p>\n    <p>\n      <input placeholder=\"Password\" type=\"password\" id=\"password\" name=\"password\" autocomplete=\"current-password\" required>\n    </p>\n    <p>\n      <button type=\"submit\">Login</button>\n    </p>\n  </form>\n</dialog>", j = ".auth-dialog{--dialog-bg:#172422;--dialog-backdrop-bg:#000;--btn-bg:#007474;--btn-bg-hover:#008b8b;--btn-color:#fff;--color:#ffe3b3;--input-bg:#02161a;--input-border:#266058;--input-border-hover:#00ccb1;background-color:var(--dialog-bg);border:none;border-radius:5px;flex-direction:column;justify-content:center;align-items:center;height:180px;margin:0;padding:15px;font-size:16px;display:flex;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%)}.auth-dialog::backdrop{background-color:var(--dialog-backdrop-bg)}.auth-dialog p{margin-bottom:16px}.auth-dialog label{color:var(--color);text-align:right;width:80px;display:inline-block}.auth-dialog input{border:1px solid var(--input-border);background-color:var(--input-bg);color:var(--color);box-sizing:border-box;border-radius:5px;outline:none;width:300px;height:28px;padding:0 8px;font-size:1rem}.auth-dialog input:active,.auth-dialog input:hover{border:1px solid var(--input-border-hover)}:-webkit-any(.auth-dialog input:-webkit-autofill,.auth-dialog input:autofill){box-shadow:0 0 0 1000px var(--input-bg) inset!important;-webkit-text-fill-color:var(--color)!important;font-size:16px!important}:is(.auth-dialog input:autofill,.auth-dialog input:autofill){box-shadow:0 0 0 1000px var(--input-bg) inset!important;-webkit-text-fill-color:var(--color)!important;font-size:16px!important}.auth-dialog button{background-color:var(--btn-bg);color:var(--btn-color);cursor:pointer;border:none;border-radius:5px;justify-content:center;align-items:center;width:300px;height:28px;font-size:16px;display:flex}.auth-dialog button:hover{background-color:var(--btn-bg-hover)}", M = () => {
	console.log("open dialog");
	let e = document.createElement("style");
	e.textContent = j, document.head.appendChild(e), document.body.insertAdjacentHTML("beforeend", A);
	let t = document.getElementById("auth-dialog");
	t.showModal(), t.querySelector("form")?.addEventListener("submit", (e) => {
		e.preventDefault();
		let n = t.querySelector("#username")?.value?.trim(), r = t.querySelector("#password")?.value?.trim();
		console.log("Username:", n), console.log("Password:", r), !(!n || !r) && y(n, (0, k.default)(r)).then((e) => {
			e.status === 200 ? (window.SS_USER = e.content, window.location.reload(), t.close()) : console.log("登录失败，考虑添加重试机制，防止连续重试登录导致死循环");
		}).catch((e) => {
			console.error("Login failed:", e);
		});
	}), t.querySelector("button")?.addEventListener("click", () => {
		console.log("click");
	});
}, N = window.location.href.includes("qbweb-qa"), P = {
	info: (...e) => {
		N && console.log(...e);
	},
	error: (...e) => {
		N && console.error(...e);
	}
}, F = () => {
	C() ? (P.info("loginInQb"), T((e) => {
		P.info("user", e, window.SS_USER), y(e.username, e.password).then((e) => {
			if (e.status === 200) {
				window.SS_USER = e.content, window.location.reload(), P.info("login success");
				return;
			}
			P.info("登录失败，考虑添加重试机制，防止连续重试登录导致死循环");
		});
	}, (e) => {
		P.info("getUser failed", e);
	})) : P.info("not inQb");
}, I = () => {
	M();
};
console.log("auth.js start"), _(), window.addEventListener(d, () => {
	console.log(`[${d}] event received`), C() ? F() : I();
}), console.log("auth.ts end");
var L = await v();
if (L.status === 200) console.log("user", L), window.SS_USER = L.content;
else throw console.log("fetchUser failed", L), Error("fetchUser failed");
//#endregion
