import cors from "cors";

const isDev = () => process.env.NODE_ENV === "development";

const getAllowedOrigins = () => {
  if (isDev()) {
    return [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5174",
      "https://lenstick-frontend-admin.vercel.app",
      "https://lens-stick.vercel.app",
      "https://lenstick-frontend-admin-ui8w.vercel.app"
    ];
  } else {
    return [
      "https://lenstick-frontend-admin.vercel.app",
      "https://lens-stick.vercel.app",
      "https://google-auth-hq3m.vercel.app/",
    ];
  }
};

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: "include",
};

export default cors(corsOptions);
