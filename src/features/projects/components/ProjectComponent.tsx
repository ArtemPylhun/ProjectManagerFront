import { useState } from "react";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import ProjectsTable from "./table/ProjectsTable";
import useProjects from "../hooks/useProjects";

const ProjectComponent = () => {
  const {
    projects,
    loading,
    handleDeleteProject,
    handleCreateProject,
    handleUpdateProject,
  } = useProjects();

  const [filterQuery, setFilterQuery] = useState<string>("");

  const handleFilterQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterQuery(event.target.value);
  };

  const filteredProjects = projects?.filter((project) => {
    return project.name.toLowerCase().includes(filterQuery.toLowerCase());
  });

  return (
    <div>
      <SearchInput
        query={filterQuery}
        onQueryChange={handleFilterQueryChange}
      />
      <LoaderComponent loading={loading}>
        <ProjectsTable
          projects={filteredProjects}
          handleDeleteProject={handleDeleteProject}
          handleCreateProject={handleCreateProject}
          handleUpdateProject={handleUpdateProject}
        />
      </LoaderComponent>
    </div>
  );
};

export default ProjectComponent;
