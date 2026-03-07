import React, { Component } from "react";
import { Navbar } from "../components/Navbar";

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4">{this.props.children}</main>
      </div>
    );
  }
}
