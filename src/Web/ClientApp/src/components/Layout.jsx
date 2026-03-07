import React, { Component } from 'react';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <NavMenu />
        <main className="max-w-7xl mx-auto px-4">
          {this.props.children}
        </main>
      </div>
    );
  }
}
