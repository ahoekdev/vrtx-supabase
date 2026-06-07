/// <reference types="astro/client" />

declare global {
  namespace App {
    interface Locals {
      isLoggedIn: boolean;
    }
  }
}

export {};
