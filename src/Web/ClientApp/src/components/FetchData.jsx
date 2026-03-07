import React, { Component } from 'react';
import { WeatherForecastsClient } from '../web-api-client.ts';

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = { forecasts: [], loading: true };
  }

  componentDidMount() {
    this.populateWeatherData();
  }

  static renderForecastsTable(forecasts) {
    return (
      <table className="w-full border-collapse text-left" aria-labelledby="tableLabel">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-4 py-2 font-semibold text-gray-700">Date</th>
            <th className="px-4 py-2 font-semibold text-gray-700">Temp. (C)</th>
            <th className="px-4 py-2 font-semibold text-gray-700">Temp. (F)</th>
            <th className="px-4 py-2 font-semibold text-gray-700">Summary</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map((forecast, i) =>
            <tr key={forecast.date} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-2">{new Date(forecast.date).toLocaleDateString()}</td>
              <td className="px-4 py-2">{forecast.temperatureC}</td>
              <td className="px-4 py-2">{forecast.temperatureF}</td>
              <td className="px-4 py-2">{forecast.summary}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : FetchData.renderForecastsTable(this.state.forecasts);

    return (
      <div>
        <h1 id="tableLabel">Weather forecast</h1>
        <p>This component demonstrates fetching data from the server.</p>
        {contents}
      </div>
    );
  }

  async populateWeatherData() {
    let client = new WeatherForecastsClient();
    const data = await client.getWeatherForecasts();
    this.setState({ forecasts: data, loading: false });
  }

}
