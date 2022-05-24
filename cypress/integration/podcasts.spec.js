/// <reference types="cypress" />

const homeurl = "http://localhost:3000"

const switchPodCast = (podcast, add) => {
  if (add == true) cy.get("#select-podcast").eq(0).click()
  cy.get("#headlessui-menu-button-1").click()
  cy.contains(podcast).click()
}

describe("newsdesk logged in", () => {
  beforeEach(() => {
    cy.request(
      "DELETE",
      `http://localhost:${firebaseConfig.emulators.firestore.port}/emulator/v1/projects/${firebaseAppConfig.projectId}/databases/(default)/documents`,
    )
    cy.visit(homeurl)
    cy.get("#login").click()
    cy.contains("Peach Otter").click()
  })

  it("should be able to logout", () => {
    cy.get("#logout").click()
    cy.contains("Login")
  })

  it("should be toggle between dark/light", () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000)
    cy.get("html").then(($btn) => {
      cy.get("#darklight").click()
      if ($btn.hasClass("dark")) cy.get("html").should("have.not.class", "dark")
      else cy.get("html").should("have.class", "dark")
    })
  })

  it("should maximise the inbox", () => {
    cy.get("#select-podcast").eq(0).click()
    cy.get("#inbox-column").should("not.have.class", "col-span-3")
    cy.get("button[title='toggle inbox expansion'").click()
    cy.get("#inbox-column").should("have.class", "col-span-3")
  })

  it("should maximise the script", () => {
    cy.get("#select-podcast").eq(0).click()
    cy.get("#script-column").should("not.have.class", "col-span-3")
    cy.get("button[title='toggle script expansion'").click()
    cy.get("#script-column").should("have.class", "col-span-3")
  })

  it("should minimise the draft", () => {
    cy.get("#select-podcast").eq(0).click()
    cy.get("#draft-column").should("have.class", "col-span-3")
    cy.get("button[title='toggle draft expansion'").click()
    cy.get("#draft-column").should("not.have.class", "col-span-3")
  })

  it("should select podcast", () => {
    cy.get("#select-podcast").eq(0).click()
  })

  it("should be able to create and delete a new item", () => {
    switchPodCast("dev sandbox", true)

    cy.get("section[slotno=7] textarea").type("new item{enter}", {
      force: true,
    })
    cy.get("section[slotno=7]").should("contain", "new item")
    cy.get("section[slotno=7] button[title='Delete']").click()
    cy.get("section[slotno=7]").should("not.contain", "new item")
  })

  it("should be able to create and share a new item", () => {
    switchPodCast("dev sandbox", true)
    cy.get("section[slotno=7] textarea").type("new share item{enter}")
    cy.get("section[slotno=7]").should("contain", "new share item")
    cy.get("section[slotno=7] button[title='Share to dev2']").click()
    cy.get("section[slotno=7] button[title='Delete']").click()
    cy.get("section[slotno=7]").should("not.contain", "new share item")
    switchPodCast("dev 2 sandbox", false)
    cy.get("#inbox-column").should("contain", "new share item")
  })

  it("should create and delete items", () => {
    switchPodCast("dev sandbox", true)
    for (let section = 1; section <= 7; section++) {
      for (let i = 1; i <= 3; i++)
        cy.get(`section[slotno=${section}] textarea`).type(
          `new item ${section} number ${i} {enter}`,
          { force: true },
        )
    }
    // @TODO: connect to firebase to check it happened
    // @TODO: cleanup
  })

  it("should be able to set slot titles", () => {
    switchPodCast("dev sandbox", true)
    for (let section = 1; section <= 7; section++)
      cy.get(`section[slotno=${section}] input`).type(
        `Slot ${section} title {enter}`,
      )
  })

  it("should move item between slots when dragging", () => {
    switchPodCast("dev sandbox", true)
    cy.get("section[slotno=7] textarea").type("dragging item{enter}", {
      force: true,
    })
    cy.get("section[slotno=7] ul div")
      .eq(0)
      .trigger("dragend", { clientX: 820, clientY: 402 }, { force: true })
    cy.get("section[slotno=6]").should("contain", "dragging item")
    cy.get("section[slotno=6] button[title='Delete']").click()
  })

  it("should move item within a slot when dragging", () => {
    switchPodCast("dev sandbox", true)
    cy.get("section[slotno=7] textarea").type("dragging item{enter}", {
      force: true,
    })
    cy.get("section[slotno=7] textarea").type("dragging item in slot{enter}", {
      force: true,
    })
    cy.get("section[slotno=7] ul li")
      .eq(0)
      .children("div[draggable='true']")
      .trigger("dragend", { clientX: 564, clientY: 289 }, { force: true })
  })

  it.skip(
    "should add item to slot and remove from inbox when dragging from inbox",
  )
})

import firebaseConfig from "../../firebase.json"
import { firebaseConfig as firebaseAppConfig } from "../../src/plugins/firebase"
