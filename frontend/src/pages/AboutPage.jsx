import React from "react";
import { Card, Badge, Timeline, List, Button } from "flowbite-react";
import {
  HiAcademicCap,
  HiCode,
  HiGlobeAlt,
  HiLightBulb,
  HiUserGroup,
} from "react-icons/hi";

const AboutPage = () => {
  const features = [
    {
      icon: HiCode,
      title: "In-depth Tutorials",
      description:
        "Comprehensive guides on programming languages and frameworks",
    },
    {
      icon: HiGlobeAlt,
      title: "Web Development Trends",
      description: "Latest insights and best practices in the tech world",
    },
    {
      icon: HiLightBulb,
      title: "Skill Enhancement",
      description: "Tips and tricks to level up your coding skills",
    },
    {
      icon: HiAcademicCap,
      title: "Expert Insights",
      description: "Learning directly from industry professionals",
    },
    {
      icon: HiUserGroup,
      title: "Community Driven",
      description: "A supportive network of learners and creators",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12">
      <Card className="mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            About ByteThoughts
          </h1>
          <Badge color="info" className="mx-auto mb-4">
            Tech Learning Platform
          </Badge>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
            Your ultimate destination for cutting-edge web development and
            programming knowledge.
          </p>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            ByteThoughts is dedicated to empowering developers and tech
            enthusiasts with high-quality, accessible learning resources. From
            beginner tutorials to advanced technical insights, we're committed
            to fostering growth and innovation in the tech community.
          </p>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            What We Offer
          </h2>
          <List>
            <List.Item icon={HiCode}>
              Tutorials on Programming Languages
            </List.Item>
            <List.Item icon={HiGlobeAlt}>Web Development Frameworks</List.Item>
            <List.Item icon={HiLightBulb}>
              Skill Enhancement Resources
            </List.Item>
            <List.Item icon={HiAcademicCap}>Expert-Led Content</List.Item>
          </List>
        </Card>
      </div>

      <Card className="mt-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
          Our Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <feature.icon className="mx-auto mb-4 h-12 w-12 text-teal-500 dark:text-teal-400" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {feature.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Our Journey
        </h2>
        <Timeline>
          <Timeline.Item>
            <Timeline.Point />
            <Timeline.Content>
              <Timeline.Title>Platform Launch</Timeline.Title>
              <Timeline.Body>
                Established ByteThoughts as a comprehensive learning platform
                for developers.
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Point />
            <Timeline.Content>
              <Timeline.Title>Community Growth</Timeline.Title>
              <Timeline.Body>
                Expanding our reach and connecting tech enthusiasts worldwide.
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
          <Timeline.Item>
            <Timeline.Point />
            <Timeline.Content>
              <Timeline.Title>Continuous Innovation</Timeline.Title>
              <Timeline.Body>
                Committed to providing up-to-date, high-quality content.
              </Timeline.Body>
            </Timeline.Content>
          </Timeline.Item>
        </Timeline>
      </Card>

      <Card className="mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Join Our Community
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Ready to start your learning journey? Explore our content, connect
          with fellow developers, and grow your skills.
        </p>
        <Button gradientDuoTone="tealToLime">Start Exploring</Button>
      </Card>
    </div>
  );
};

export default AboutPage;
