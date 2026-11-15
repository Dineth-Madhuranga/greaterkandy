export type ObjectKind = "megaphone" | "billboard" | "kiosk" | "flower";

// Original vector artwork is also a useful, immediate fallback without WebGL.
export function ObjectArt({ kind }: { kind: ObjectKind }) {
  return (
    <svg
      className={`object-art art-${kind}`}
      viewBox="0 0 500 500"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`blue-${kind}`}
          x1="60"
          y1="100"
          x2="400"
          y2="400"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#747fff" />
          <stop offset="1" stopColor="#243598" />
        </linearGradient>
        <linearGradient id={`lime-${kind}`}>
          <stop stopColor="#e0ff86" />
          <stop offset="1" stopColor="#b6fe00" />
        </linearGradient>
      </defs>
      {kind === "megaphone" && (
        <g transform="rotate(-24 250 250)">
          <path
            d="m186 284 66 13-16 115-57-10Z"
            fill="#f67b05"
            stroke="#d65b00"
            strokeWidth="9"
          />
          <path d="m112 212 230-92v247l-230-91Z" fill={`url(#blue-${kind})`} />
          <ellipse cx="345" cy="242" rx="76" ry="126" fill="#b6fe00" />
          <ellipse cx="345" cy="242" rx="58" ry="106" fill="#fdfbe8" />
          <ellipse cx="335" cy="242" rx="29" ry="73" fill="#c9cdb8" />
          <ellipse cx="114" cy="244" rx="29" ry="34" fill="#fa8005" />
          <path
            d="M438 166 464 148M449 233h32M434 302l26 19"
            stroke="#013900"
            strokeWidth="11"
            strokeLinecap="round"
          />
        </g>
      )}
      {kind === "billboard" && (
        <g transform="rotate(-9 250 250)">
          <path
            d="M162 298v149m177-149v149"
            stroke="#013900"
            strokeWidth="22"
          />
          <rect x="65" y="65" width="380" height="285" rx="15" fill="#013900" />
          <rect x="83" y="83" width="344" height="249" fill="#b6fe00" />
          <path
            d="m372 115-77 77m0-77h77v77"
            stroke="#013900"
            strokeWidth="15"
          />
          <text
            x="107"
            y="177"
            fill="#013900"
            fontFamily="Impact, sans-serif"
            fontSize="70"
          >
            GOOD
          </text>
          <text
            x="107"
            y="241"
            fill="#013900"
            fontFamily="Impact, sans-serif"
            fontSize="70"
          >
            IDEAS GO
          </text>
          <text
            x="107"
            y="307"
            fill="#013900"
            fontFamily="Impact, sans-serif"
            fontSize="70"
          >
            PLACES.
          </text>
        </g>
      )}
      {kind === "kiosk" && (
        <g transform="rotate(9 250 250)">
          <path
            d="M230 380v59m-70 8h180"
            stroke="#013900"
            strokeWidth="25"
            strokeLinecap="round"
          />
          <rect
            x="120"
            y="38"
            width="256"
            height="359"
            rx="31"
            fill={`url(#blue-${kind})`}
          />
          <rect
            x="140"
            y="60"
            width="216"
            height="299"
            rx="13"
            fill="#b6fe00"
          />
          <text
            x="159"
            y="158"
            fill="#013900"
            fontFamily="Impact, sans-serif"
            fontSize="67"
          >
            HELLO
          </text>
          <text
            x="159"
            y="224"
            fill="#013900"
            fontFamily="Impact, sans-serif"
            fontSize="64"
          >
            KANDY.
          </text>
          <circle cx="248" cy="294" r="38" fill="#fa8005" />
          <path
            d="m228 314 40-40m-40 0h40v40"
            stroke="#013900"
            strokeWidth="8"
          />
        </g>
      )}
      {kind === "flower" && (
        <g>
          <path d="M250 380V212" stroke="#034102" strokeWidth="24" />
          <ellipse
            cx="201"
            cy="299"
            rx="58"
            ry="25"
            transform="rotate(30 201 299)"
            fill="#034102"
          />
          <ellipse
            cx="293"
            cy="265"
            rx="54"
            ry="22"
            transform="rotate(-30 293 265)"
            fill="#034102"
          />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse
              key={a}
              cx="250"
              cy="110"
              rx="39"
              ry="65"
              transform={`rotate(${a} 250 183)`}
              fill={`url(#blue-${kind})`}
              stroke="#243598"
              strokeWidth="3"
            />
          ))}
          <circle cx="250" cy="183" r="47" fill="#f7d000" />
          <path d="m166 352 25 103h122l25-103Z" fill="#fa8005" />
          <ellipse cx="252" cy="352" rx="86" ry="23" fill="#d66000" />
          <path
            d="M223 184h3m47 0h3"
            stroke="#013900"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M235 203q15 15 30 0"
            stroke="#013900"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
}
