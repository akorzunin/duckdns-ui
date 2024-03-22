import { useQuery } from "@tanstack/react-query";
import { DefaultService } from "../api/client";
import DomainList from "../components/DomainList";
import MainFooter from "../components/MainFooter";
import MainHeader from "../components/MainHeader";
import AddDomainButton from "../components/buttons/AddDomainButton";
import { atom, useSetAtom } from "jotai";

export interface IrefetchAllDomainsAtom {
  fn: () => void;
}
export const refetchAllDomainsAtom = atom<IrefetchAllDomainsAtom>({
  fn: async () => {},
});

const MainPage = () => {
  const { data: domains, refetch: refetchAllDomains } = useQuery({
    queryKey: ["domains"],
    queryFn: () => DefaultService.getApiAllDomains(),
    refetchInterval: 5000,
  });
  const setRefetchAllDomins = useSetAtom(refetchAllDomainsAtom);
  setRefetchAllDomins({ fn: refetchAllDomains });

  return (
    <>
      <div className="container mx-auto px-10 py-6">
        <MainHeader />
        <div className="flex justify-end px-4 py-4">
          <AddDomainButton />
        </div>
        <DomainList domains={domains} />
      </div>
      <MainFooter />
    </>
  );
};

export default MainPage;
