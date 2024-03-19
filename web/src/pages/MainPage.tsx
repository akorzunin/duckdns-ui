import { useQuery } from "@tanstack/react-query";
import { DefaultService } from "../api/client";
import DomainList from "../components/DomainList";
import MainFooter from "../components/MainFooter";
import MainHeader from "../components/MainHeader";
import AddDomainButton from "../components/buttons/AddDomainButton";

const MainPage = () => {
  const {
    data: domains,
    refetch: refetchDomains,
  } = useQuery({
    queryKey: ["domains"],
    queryFn: () => DefaultService.getApiAllDomains(),
  });

  return (
    <>
      <div className="container mx-auto px-10 py-6">
        <MainHeader />
        <div className="flex justify-end px-4 py-4">
          <AddDomainButton />
        </div>
        <DomainList domains={domains}/>
      </div>
      <MainFooter />
    </>
  );
};

export default MainPage;
