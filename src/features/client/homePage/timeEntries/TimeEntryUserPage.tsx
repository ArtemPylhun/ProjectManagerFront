import { Button, Form, Space, Table, Tooltip } from "antd";
import { useCallback, useState, useEffect, useMemo } from "react";
import { EditOutlined } from "@ant-design/icons";
import { TimeEntryInterface } from "../../../timeEntries/interfaces/TimeEntryInterface";
import { ModalModes } from "../../../../types/modalModes";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import SearchInput from "../../../../components/common/SearchInput";
import CustomModal from "../../../../components/common/CustomModal";
import TimeEntryForm from "../../../timeEntries/components/forms/TimeEntryForm";
import useTimeEntries from "../../../timeEntries/hooks/useTimeEntries";
import useTimeEntryModal from "../../../timeEntries/hooks/useTimeEntryModal";
import useProjects from "../../../projects/hooks/useProjects";
import useProjectTasks from "../../../projectTasks/hooks/useProjectTasks";
import useUserId from "../../../../hooks/useUserId";
import dayjs from "dayjs";
import useUsers from "../../../users/hooks/useUsers";

const TimeEntryUserPage: React.FC = () => {
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const [groupedTimeEntries, setGroupedTimeEntries] = useState<
    Record<string, TimeEntryInterface[]>
  >({});

  const { users } = useUsers();

  const { projects } = useProjects(true, false);

  const { projectTasks } = useProjectTasks(true, false);

  const {
    timeEntries,
    handleCreateTimeEntry,
    handleDeleteTimeEntry,
    handleUpdateTimeEntry,
    loading,
    currentPage,
    pageSize,
    totalCount,
    handlePageChange,
  } = useTimeEntries(true);

  const {
    modalMode,
    isModalVisible,
    newTimeEntry,
    selectedTimeEntry,
    setNewTimeEntry,
    setSelectedTimeEntry,
    selectedProject,
    selectedProjectTask,
    selectedUser,
    setSelectedProject,
    setSelectedProjectTask,
    setSelectedUser,
    showModal,
    hideModal,
  } = useTimeEntryModal();

  const { userId } = useUserId();

  const handleFilterQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const memoizedFilteredTimeEntries = useMemo(() => {
    if (!timeEntries || !Array.isArray(timeEntries)) return [];
    return timeEntries.filter(
      (timeEntry: TimeEntryInterface) =>
        timeEntry.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (timeEntry.project?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (timeEntry.projectTask?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [timeEntries, searchQuery, currentPage, totalCount]);

  useEffect(() => {
    try {
      if (memoizedFilteredTimeEntries.length > 0) {
        const grouped = memoizedFilteredTimeEntries.reduce(
          (acc: Record<string, TimeEntryInterface[]>, entry) => {
            if (!entry.startTime) {
              console.warn("Skipping entry with missing startTime:", entry);
              return acc;
            }
            const date = dayjs(entry.startTime).format("ddd, MMM DD");
            acc[date] = [...(acc[date] || []), entry];
            return acc;
          },
          {}
        );
        setGroupedTimeEntries(grouped);
      } else {
        console.warn(
          "No filtered time entries to group:",
          memoizedFilteredTimeEntries
        );
        setGroupedTimeEntries({});
      }
    } catch (error) {
      console.error("Error grouping time entries:", error);
      setGroupedTimeEntries({});
    }
  }, [memoizedFilteredTimeEntries]);

  const handleSave = useCallback(async () => {
    if (!modalMode) return;

    try {
      await form.validateFields();

      let result = false;

      if (
        modalMode === ModalModes.CREATE &&
        newTimeEntry &&
        selectedUser &&
        selectedProject
      ) {
        newTimeEntry.minutes = dayjs(newTimeEntry.endTime).diff(
          newTimeEntry.startTime,
          "minute"
        );
        result = await handleCreateTimeEntry({
          ...newTimeEntry,
          userId: userId || "",
          projectId: selectedProject.id,
          projectTaskId: selectedProjectTask?.id || "",
        });
      } else if (modalMode === ModalModes.UPDATE && selectedTimeEntry) {
        selectedTimeEntry.minutes = dayjs(selectedTimeEntry.endTime).diff(
          selectedTimeEntry.startTime,
          "minute"
        );
        result = await handleUpdateTimeEntry({
          ...selectedTimeEntry,
          userId: selectedUser!.id,
          projectId: selectedProject!.id,
          projectTaskId: selectedProjectTask!.id,
        });
      } else if (modalMode === ModalModes.DELETE) {
        result = await handleDeleteTimeEntry(selectedTimeEntry?.id || "");
      }
      if (result) hideModal();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  }, [
    modalMode,
    newTimeEntry,
    selectedProject,
    selectedProjectTask,
    selectedUser,
    handleCreateTimeEntry,
    handleDeleteTimeEntry,
    hideModal,
  ]);

  const columns = [
    {
      title: "Description - Project - Task",
      dataIndex: "description",
      key: "description",
      render: (_: string, record: TimeEntryInterface) => {
        try {
          const maxLength = 40;
          const description = record.description || "Add description";
          const projectName = record.project?.name || "";
          const taskName = record.projectTask?.name || "";
          const fullText = `${description} - ${projectName} - ${taskName}`;
          const truncated =
            fullText.length > maxLength
              ? `${fullText.substring(0, maxLength)}...`
              : fullText;
          return (
            <Tooltip title={fullText} placement="top">
              <div className="description">{truncated}</div>
            </Tooltip>
          );
        } catch (error) {
          console.error("Error rendering description:", error, record);
          return <div className="description">Error loading entry</div>;
        }
      },
    },
    {
      title: "Time From",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime: Date | string | null) => {
        try {
          if (!startTime) return "N/A";
          return dayjs(startTime).isValid()
            ? dayjs(startTime).format("HH:mm")
            : "N/A";
        } catch (error) {
          console.error("Error rendering Time From:", error, startTime);
          return "N/A";
        }
      },
    },
    {
      title: "Time To",
      dataIndex: "endTime",
      key: "endTime",
      render: (endTime: Date | string | null) => {
        try {
          if (!endTime) return "N/A";
          return dayjs(endTime).isValid()
            ? dayjs(endTime).format("HH:mm")
            : "N/A";
        } catch (error) {
          console.error("Error rendering Time To:", error, endTime);
          return "N/A";
        }
      },
    },
    {
      title: "Minutes",
      dataIndex: "minutes",
      key: "minutes",
      render: (minutes: number | null) => minutes || 0,
    },
    {
      title: "Actions",
      key: "actions",
      render: (timeEntry: TimeEntryInterface) => (
        <Space>
          <Button
            className="action-button"
            icon={<EditOutlined />}
            onClick={() => showModal(timeEntry, ModalModes.UPDATE)}
          />
          <Button
            className="action-button danger"
            icon={<DeleteOutlined />}
            onClick={() => showModal(timeEntry, ModalModes.DELETE)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="projects-page">
        <div className="projects-header">
          <h1>My Time Table</h1>
          <SearchInput
            query={searchQuery}
            onQueryChange={handleFilterQueryChange}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "16px",
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="create-project-button"
            onClick={() => showModal(null, ModalModes.CREATE)}
          >
            Create Time Entry
          </Button>
        </div>
        <div className="time-entries-container">
          {Object.entries(groupedTimeEntries).map(([date, entries]) => (
            <div key={date} className="time-entry-day">
              <div className="day-header">
                <h2>{date}</h2>
                <span className="day-total">
                  Total:{" "}
                  {Math.floor(
                    entries.reduce(
                      (sum, entry) => sum + (entry.minutes || 0),
                      0
                    ) / 60
                  )
                    .toString()
                    .padStart(2, "0")}
                  :
                  {(
                    entries.reduce(
                      (sum, entry) => sum + (entry.minutes || 0),
                      0
                    ) % 60
                  )
                    .toString()
                    .padStart(2, "0")}
                </span>
              </div>
              <Table
                dataSource={entries}
                columns={columns}
                rowKey="id"
                className="modern-table"
                pagination={{
                  current: currentPage,
                  pageSize,
                  total: totalCount,
                  onChange: handlePageChange,
                }}
                locale={{ emptyText: "No entries for this day." }}
              />
            </div>
          ))}
          {Object.keys(groupedTimeEntries).length === 0 && !loading && (
            <div className="empty-state">No time entries found.</div>
          )}
        </div>
      </div>
      <CustomModal
        visible={isModalVisible}
        title={
          modalMode === ModalModes.CREATE
            ? "Create Time Entry"
            : modalMode === ModalModes.UPDATE
            ? "Update Time Entry"
            : "Delete Time Entry"
        }
        isDanger={modalMode === ModalModes.DELETE}
        okText={
          modalMode === ModalModes.CREATE
            ? "Create"
            : modalMode === ModalModes.UPDATE
            ? "Update"
            : "Delete"
        }
        onOk={handleSave}
        onCancel={hideModal}
      >
        {modalMode === ModalModes.CREATE && (
          <TimeEntryForm
            form={form}
            timeEntryData={{
              ...newTimeEntry,
              user: users?.find((x) => x.id === userId) || "",
              userId: userId || "",
            }}
            setTimeEntryData={setNewTimeEntry}
            isCreateMode={true}
            users={users || []}
            projects={projects || []}
            projectTasks={projectTasks || []}
            selectedUser={selectedUser}
            selectedProject={selectedProject}
            selectedProjectTask={selectedProjectTask}
            setSelectedUser={setSelectedUser}
            setSelectedProject={setSelectedProject}
            setSelectedProjectTask={setSelectedProjectTask}
            loading={loading}
            isUserCreator={true}
          />
        )}

        {modalMode === ModalModes.UPDATE && selectedTimeEntry && (
          <TimeEntryForm
            form={form}
            timeEntryData={selectedTimeEntry}
            setTimeEntryData={setSelectedTimeEntry}
            isCreateMode={true}
            users={users || []}
            projects={projects || []}
            projectTasks={projectTasks || []}
            selectedUser={selectedUser}
            selectedProject={selectedProject}
            selectedProjectTask={selectedProjectTask}
            setSelectedUser={setSelectedUser}
            setSelectedProject={setSelectedProject}
            setSelectedProjectTask={setSelectedProjectTask}
            loading={loading}
            isUserCreator={true}
          />
        )}
        {modalMode === ModalModes.DELETE && (
          <p>Are you sure you want to delete this time entry?</p>
        )}
      </CustomModal>
    </>
  );
};

export default TimeEntryUserPage;
