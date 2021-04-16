/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import './storyOne.styles.scss';
import listCity from '../../resources/json/city.list.min.json';
import { getOneCallDailyByCityName } from '../../api/api';
import _ from 'lodash';
import axios from 'axios';
import { DOMAIN_SERVER, API_KEY } from '../../utils/config';
import moment from 'moment';
import {
  Layout,
  List,
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Select,
  Modal,
  Input,
} from 'antd';
const { Option } = Select;
const { Header, Content } = Layout;
const { Title } = Typography;
function StoryOne() {
  const [listQueryCity, setListQueryCity] = useState('');
  const [listWeatherData, setListWeatherData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addCity, setAddCity] = useState({});
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setListWeatherData((preState) => {
      const updateList = preState.filter((item) => item !== 'add');
      updateList.push(addCity, 'add');
      localStorage.setItem(
        'dataCityBackup',
        JSON.stringify(updateList.filter((item) => item))
      );
      console.log(JSON.parse(localStorage.getItem('dataCityBackup')));
      return updateList;
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  async function onChange(value) {
    const query = JSON.parse(value);
    await axios
      .get(`http://${DOMAIN_SERVER}/onecall`, {
        params: {
          lat: query.lat,
          lon: query.lon,
          exclude: 'current,minutely,hourly,alerts',
          appid: API_KEY,
        },
      })
      .then((res) => {
        setAddCity({ ...res.data, name: query.name });
      })
      .catch((e) => console.error(e));
  }

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
    if (localStorage.getItem('dataCityBackup'))
      setListWeatherData(JSON.parse(localStorage.getItem('dataCityBackup')));
    else setListWeatherData(['add']);
    // fetchData();
  }, []);

  return (
    <>
      <Layout>
        <Header>
          <img src="./images/logo.png" alt="logo" height="40px" />
        </Header>
        <Layout>
          <Content>
            <Title level={2}>Dashboard</Title>
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
                  <Col onClick={showModal}>
                    <Card className="add-city">+ Add city</Card>
                  </Col>
                )
              }
            />
          </Content>
        </Layout>
      </Layout>
      <Modal
        title="Choose a city"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Select
          showSearch
          style={{ width: 320 }}
          placeholder="City name"
          optionFilterProp="children"
          onChange={onChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {_.map(listCity.slice(0, 1000), (e) => (
            <Option
              key={e.id}
              value={`{ "lat":"${e.coord.lat}", "lon":"${e.coord.lon}", "name":"${e.name}" }`}
            >
              {e.name}
            </Option>
          ))}
        </Select>
        ,
      </Modal>
      ;
    </>
  );
}

export default StoryOne;
