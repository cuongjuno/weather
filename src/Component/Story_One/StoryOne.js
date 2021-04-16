/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './storyOne.styles.scss';
import listCity from '../../resources/json/city.list.min.json';
import { getOneCallDailyByCityName } from '../../api/api';
import moment from 'moment';
import { Layout, List, Card, Typography, Row, Col, Divider } from 'antd';
const { Header, Content } = Layout;
const { Title } = Typography;
function StoryOne() {
  const [listQueryCity, setListQueryCity] = useState(listCity.slice(0, 8));
  const [listWeatherData, setListWeatherData] = useState([]);
  const fetchData = async () => {
    Promise.all(
      listQueryCity.map((e) => {
        return getOneCallDailyByCityName({
          lat: e.coord.lat,
          lon: e.coord.lon,
          name: e.name,
        });
      })
    ).then((res) => setListWeatherData([...res, 'add']));
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    console.log(listWeatherData);
  }, [listWeatherData]);

  return (
    <>
      <Layout>
        <Header>
          <img src="./images/logo.png" alt="logo" height="40px" />
        </Header>
        <Layout>
          <Content>
            <Title level={2}>h2. Ant Design</Title>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 6,
                xxl: 3,
              }}
              dataSource={listWeatherData}
              renderItem={(item) =>
                item != 'add' ? (
                  <List.Item>
                    <Card title={item.name}>
                      <Row>
                        <Col span={12}>
                          <div className="weather-icon">
                            <img
                              src={`http://openweathermap.org/img/wn/${item.daily[0].weather[0].icon}@2x.png`}
                              alt={item.daily[0].weather[0].main}
                            ></img>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="weather-content">
                            {moment().format('dddd, MMMM Do YYYY')}
                            <Divider />
                            <Typography.Paragraph>
                              {Math.floor(item.daily[0].temp.min - 273.15)}°C/
                              {Math.floor(item.daily[0].temp.max - 273.15)}°C
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                              {item.daily[0].weather[0].main}
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                              {item.daily[0].humidity}% Humidity
                            </Typography.Paragraph>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </List.Item>
                ) : (
                  <Col>
                    <Card className="add-city">+ Add city</Card>
                  </Col>
                )
              }
            />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default StoryOne;
