import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

// Serve CSS, JS, images, etc. from /static/
app.use('/static/*', serveStatic({ root: './' }));

// Route: main page
app.get('/', serveStatic({ path: './index.html', root: './' }));

// Route: login
app.get('/login', serveStatic({ path: './login.html', root: './' }));

// Route: board games
app.get('/board-games', serveStatic({ path: './board-games.html', root: './' }));

// Route: calendar
app.get('/calendar', serveStatic({ path: './calendar.html', root: './' }));

// Optional: 404 fallback (if you want to be fancy later)
app.notFound((c) => c.text('Page not found', 404));

serve({ fetch: app.fetch, port: 5173 }, () => {
    console.log("Frontend running at http://localhost:5173");
});
