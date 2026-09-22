import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/profile",
  "/program",
  "/program/transformasi-digital",
  "/program/kolaborasi-nasional-global",
  "/program/kaderisasi-adaptif",
  "/program/meritokrasi-kepemimpinan",
  "/program/profesionalisme-organisasi",
  "/kontak",
  "/aspirasi",
];

async function skipWelcome(page: import("@playwright/test").Page) {
  await page.addInitScript(() =>
    sessionStorage.setItem("yusuf-welcome-seen", "1"),
  );
}

test("Yusuf identity and green-white-black palette are applied", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const welcome = page.getByRole("dialog", {
    name: "Ruang gagasan, dialog, dan ikhtiar bersama.",
  });
  await expect(welcome).toBeVisible();
  await expect(
    welcome.getByRole("img", { name: "Tanda tangan Yusuf Sugiyarto" }),
  ).toBeVisible();
  await expect(
    welcome.getByRole("article", { name: "Sambutan lengkap" }),
  ).toBeVisible();
  await welcome.locator(".welcome-content").evaluate((element) => {
    element.scrollTo({ top: element.scrollHeight });
  });
  await expect(
    welcome.getByText(/Akhir kata, dengan penuh hormat/),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(welcome).not.toBeVisible();
  await page
    .getByRole("button", { name: "Baca sambutan", exact: true })
    .click();
  await expect(welcome).toBeVisible();
  await welcome.getByRole("button", { name: "Lanjut ke situs" }).click();
  await expect(
    page.getByRole("heading", { name: "Yusuf Sugiyarto" }),
  ).toBeVisible();
  await expect(page.getByAltText("Potret Yusuf Sugiyarto")).toBeVisible();
  await expect(page.getByRole("img", { name: "Askara" }).first()).toBeVisible();
  await expect(
    page.locator(".hero-copy").getByText("Calon Ketua Umum PB HMI"),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Lihat Program/ })).toBeVisible();
  const palette = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    return {
      accent: styles.getPropertyValue("--accent").trim(),
      background: styles.getPropertyValue("--background").trim(),
      foreground: styles.getPropertyValue("--foreground").trim(),
    };
  });
  expect(palette).toEqual({
    accent: "#08783f",
    background: "#f7faf7",
    foreground: "#101813",
  });

  await page.goto("/profile", { waitUntil: "domcontentloaded" });
  await expect(welcome).not.toBeVisible();
  await expect(
    page.getByRole("heading", { name: "S1 Teknik Telekomunikasi" }),
  ).toBeVisible();
  await expect(
    page.getByText("Ketua Umum", { exact: true }).first(),
  ).toBeVisible();
  for (const degree of ["S2 Ilmu Hukum", "S2 Manajemen"]) {
    const card = page.locator(".info-card").filter({ hasText: degree });
    await expect(card).toBeVisible();
    await expect(
      card.locator(":scope > span.profile-history-date"),
    ).toHaveCount(0);
  }

  await page.goto("/program", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".program-active-count")).toHaveCount(0);
  await expect(page.locator(".program-pagination-dot")).toHaveCount(5);
  await expect(
    page.getByRole("heading", { name: "Transformasi Digital" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Tampilkan program 3: Kaderisasi Adaptif" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Kaderisasi Adaptif" }),
  ).toBeVisible();
  await expect(page.getByText("Ruang Kolaborasi")).toBeVisible();

  const movementImage = page.getByAltText(
    "Yusuf Sugiyarto berada di tengah ruang gerakan dan dialog",
  );
  await movementImage.scrollIntoViewIfNeeded();
  await expect(movementImage).toBeVisible();
  await expect(page.getByText("Dari gagasan menuju gerakan")).toBeVisible();

  await page.goto("/kontak", { waitUntil: "domcontentloaded" });
  const aspirationSection = page.locator(".contact-aspiration-section");
  await expect(
    aspirationSection.getByRole("heading", {
      name: "Suara Anda, bagian dari gerak kita.",
    }),
  ).toBeVisible();
  await expect(aspirationSection.locator("form")).toBeVisible();
  await expect(
    aspirationSection.getByRole("link", { name: "Sampaikan Aspirasi" }),
  ).toHaveCount(0);
});

test("public routes render without horizontal overflow", async ({ page }) => {
  test.setTimeout(180_000);
  await skipWelcome(page);
  for (const route of publicRoutes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflow, `${route} overflows horizontally`).toBe(false);
    if (route === "/profile") {
      const galleryCardsFit = await page
        .locator(".profile-gallery-item")
        .evaluateAll((cards) =>
          cards.every((card) => {
            const rect = card.getBoundingClientRect();
            return (
              rect.width > 0 && rect.left >= -1 && rect.right <= innerWidth + 1
            );
          }),
        );
      expect(galleryCardsFit, "profile gallery cards fit the viewport").toBe(
        true,
      );
    }
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
    ).toBe("auto");
  }
});

test("navigation and keyboard skip link work", async ({ page }) => {
  await skipWelcome(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Lewati ke konten" }),
  ).toBeFocused();

  if ((page.viewportSize()?.width ?? 1024) <= 900) {
    await page.getByRole("button", { name: "Buka menu" }).click();
  }
  await page
    .getByRole("navigation", { name: "Navigasi utama" })
    .getByRole("link", { name: "Program", exact: true })
    .click();
  await expect(page).toHaveURL(/\/program$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("homepage has no serious or critical automated accessibility violations", async ({
  page,
}) => {
  await skipWelcome(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.addScriptTag({
    path: require.resolve("axe-core/axe.min.js"),
  });
  const violations = await page.evaluate(async () => {
    const result = await (
      window as typeof window & {
        axe: {
          run: (options: unknown) => Promise<{
            violations: Array<{ impact: string | null; id: string }>;
          }>;
        };
      }
    ).axe.run({
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
    });
    return result.violations.filter(
      (item) => item.impact === "critical" || item.impact === "serious",
    );
  });
  expect(violations).toEqual([]);
});

test("admin login and protected dashboard work", async ({ page }) => {
  test.skip(
    test.info().project.name !== "desktop-chrome",
    "Admin authentication is exercised once to avoid consuming the demo login rate limit.",
  );
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  test.skip(!email || !password, "E2E admin credentials are not configured");

  await page.goto("/admin/login");
  await expect(
    page.getByRole("navigation", { name: "Navigasi utama" }),
  ).toHaveCount(0);
  await page.getByLabel("Email").fill(email!);
  await page.getByLabel("Kata sandi").fill(password!);
  await page.getByRole("button", { name: "Masuk ke CMS" }).click();
  await expect(page).toHaveURL(/\/admin$/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: /Dashboard/i })).toBeVisible();

  for (const viewport of [
    { width: 768, height: 1024 },
    { width: 375, height: 812 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/admin/aspirasi");
    await expect(page.getByRole("heading", { name: "Aspirasi" })).toBeVisible();
    const pageOverflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(
      pageOverflows,
      `admin aspirations overflows at ${viewport.width}px`,
    ).toBe(false);
    await expect(page.locator("table")).toBeVisible();
  }
});
