import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button } from "antd";
import { ProjectInterface } from "../../../projects/interfaces/ProjectInterface";
import SearchInput from "../../../../components/common/SearchInput";
import useProjects from "../../../projects/hooks/useProjects";
import "../../../../styles/client-styles/projects/projectsStyles.css";

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { projects } = useProjects(true);

  const handleFilterQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const filteredProjects = projects?.filter(
    (project: ProjectInterface) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: ProjectInterface) => (
        <Button
          type="link"
          className="view-detail-button"
          onClick={() => navigate(`/projects/${record.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>My Projects</h1>
        <SearchInput
          query={searchQuery}
          onQueryChange={handleFilterQueryChange}
        />
      </div>
      <Table
        dataSource={filteredProjects}
        columns={columns}
        rowKey="id"
        className="modern-table"
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: "No projects found." }} // Handle empty state
      />
    </div>
  );
};

export default ProjectsPage;
