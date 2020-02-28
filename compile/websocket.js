#!/usr/bin/env node
             
const _crypto = require('crypto');             
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const u = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function x(c, d) {
  return (d = u[d]) ? `\x1b[${d}m${c}\x1b[0m` : c;
}
;const y = _crypto.createHash;
function z(c) {
  c = JSON.stringify(c);
  const d = Buffer.byteLength(c), h = 126 > d ? 0 : 2;
  var k = 0 === h ? d : 126;
  const e = Buffer.alloc(2 + h + d);
  e.writeUInt8(129, 0);
  e.writeUInt8(k, 1);
  k = 2;
  0 < h && (e.writeUInt16BE(d, 2), k += h);
  e.write(c, k);
  return e;
}
function A(c) {
  return y("sha1").update(`${c}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`, "binary").digest("base64");
}
;module.exports = {_websocket:function(c, d = {}) {
  const {onMessage:h = () => {
  }, onConnect:k = () => {
  }, log:e = !0} = d, q = {};
  c.on("upgrade", function(l, n) {
    if ("websocket" != l.headers.upgrade) {
      n.end("HTTP/1.1 400 Bad Request");
    } else {
      var v = l.headers["sec-websocket-protocol"], m = l.headers["sec-websocket-key"];
      l = ["HTTP/1.1 101 Web Socket Protocol Handshake", "Upgrade: WebSocket", "Connection: Upgrade", `Sec-WebSocket-Accept: ${A(m)}`];
      (v ? v.split(",").map(a => a.trim()) : []).includes("json") && l.push("Sec-WebSocket-Protocol: json");
      n.write(l.join("\r\n") + "\r\n\r\n");
      e && console.log(x("Client connected.", "green"));
      n.on("data", a => {
        var b = a.readUInt8(0) & 15;
        if (8 === b) {
          a = null;
        } else {
          if (1 === b) {
            var f = a.readUInt8(1), g = !!(f >>> 7 & 1);
            b = 2;
            f &= 127;
            if (125 < f) {
              if (126 === f) {
                f = a.readUInt16BE(b), b += 2;
              } else {
                throw a.readUInt32BE(b), a.readUInt32BE(b + 4), Error("Large payloads not currently implemented");
              }
            }
            if (g) {
              var w = a.readUInt32BE(b);
              b += 4;
            }
            var r = Buffer.alloc(f);
            if (g) {
              for (let p = 0, t = 0; p < f; ++p, t = p % 4) {
                g = 3 == t ? 0 : 3 - t << 3;
                g = (0 == g ? w : w >>> g) & 255;
                const B = a.readUInt8(b++);
                r.writeUInt8(g ^ B, p);
              }
            } else {
              a.copy(r, 0, b++);
            }
            a = `${r}`;
          } else {
            a = void 0;
          }
        }
        a ? h(m, a) : null === a && (delete q[m], e && console.log(x("Client disconnected.", "red")));
      });
      q[m] = (a, b) => {
        n.write(z({event:a, message:b}));
      };
      k(m);
    }
  });
  return q;
}};


//# sourceMappingURL=websocket.js.map