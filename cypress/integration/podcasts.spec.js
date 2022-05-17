/// <reference types="cypress" />

const homeurl = "http://localhost:3000"

describe("newsdesk login", () => {
  beforeEach(() => {
    cy.visit(homeurl)
  })

  it("should have login button", function () {
    cy.get("button").should("have.text", "Login with Google")
    cy.contains("Login with Google").click()
  })

  it("should login", function () {
    cy.contains("Login with Google").click()
    cy.contains("Peach Otter").click()
    cy.get("h2").should("have.text", "⬆️ select a podcast ⬆️")
  })
})

describe("newsdesk logged in", () => {
  before(() => {
    cy.visit(homeurl)
    cy.contains("Login with Google").click()
    cy.contains("Peach Otter").click()
  })
  beforeEach(() => {
    // cy.visit(homeurl)
  })

  it("select podcast", function () {
    cy.get("#headlessui-menu-button-1").click()
    cy.contains("dev sandbox").click()
    cy.url().should("include", "/#/dev")
  })

  it("should be able to create and delete a new item", () => {
    cy.get("#headlessui-menu-button-1").click()
    cy.contains("dev sandbox").click()

    cy.get("section[slotno=7] textarea").type("new item{enter}")
    cy.get("section[slotno=7]").should("contain", "new item")
    cy.get("section[slotno=7] button[title='Delete']").click()
    cy.get("section[slotno=7]").should("not.contain", "new item")
  })

  it("should be able to create and share a new item", () => {
    cy.get("#headlessui-menu-button-1").click()
    cy.contains("dev sandbox").click()

    cy.get("section[slotno=7] textarea").type("new share item{enter}")
    cy.get("section[slotno=7]").should("contain", "new share item")
    cy.get("section[slotno=7] button[title='Share to dev2']").click()
    cy.get("section[slotno=7] button[title='Delete']").click()
    cy.get("section[slotno=7]").should("not.contain", "new share item")
    cy.get("#headlessui-menu-button-1").click()
    cy.contains("dev 2 sandbox").click()
    // cy.scrollTo("top")
    // cy.get("#inbox-column").should("contain", "new share item")
  })
})
