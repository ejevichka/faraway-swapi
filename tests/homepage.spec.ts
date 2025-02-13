import { test, expect } from "@playwright/test";

test("CharacterList Component", () => {
  test.beforeEach(async ({ page }) => {
    const mockPeopleData = {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          name: "Luke Skywalker",
          height: "172",
          mass: "77",
          hair_color: "blond",
          skin_color: "fair",
          eye_color: "blue",
          birth_year: "19BBY",
          gender: "male",
          homeworld: "https://swapi.dev/api/planets/1/",
          films: [],
          species: [],
          vehicles: [],
          starships: [],
          created: "2014-12-09T13:50:51.644000Z",
          edited: "2014-12-20T21:17:56.891000Z",
          url: "https://swapi.dev/api/people/1/",
        },
        {
          name: "Leia Organa",
          height: "150",
          mass: "49",
          hair_color: "brown",
          skin_color: "light",
          eye_color: "brown",
          birth_year: "19BBY",
          gender: "female",
          homeworld: "https://swapi.dev/api/planets/2/",
          films: [],
          species: [],
          vehicles: [],
          starships: [],
          created: "2014-12-10T13:50:51.644000Z",
          edited: "2014-12-21T21:17:56.891000Z",
          url: "https://swapi.dev/api/people/2/",
        },
      ],
    };

    await page.route("**/api/people", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockPeopleData),
      });
    });

    await page.goto("http://localhost:3000");
  });

  test("should render the CharacterList component with mock data", async ({
    page,
  }) => {
    await expect(page.locator("h1")).toContainText("Star Wars Characters");
  });

  test("should display Luke Skywalker in the list", async ({ page }) => {
    await expect(page.locator("text=Luke Skywalker")).toBeVisible();
  });

  test("should display Leia Organa in the list", async ({ page }) => {
    await expect(page.locator("text=Leia Organa")).toBeVisible();
  });
});
