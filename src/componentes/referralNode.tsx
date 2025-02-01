import React, { useState, useEffect } from "react";
import { fetchReferralTree } from "@/services/Web3Services";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";

interface ReferralNodeType {
  address: string | null;
  children?: ReferralNodeType[];
}

function getBackgroundColor(level: number): string {
  const red = Math.min(80 + level * 15, 255);
  const green = Math.min(230 + level * 10, 150);
  const blue = Math.min(81 + level * 10, 200);
  const opacity = Math.max(1 - level * 0.1, 0);

  return `rgb(${red}, ${green}, ${blue}, ${opacity})`;
}

interface ReferralNodeProps {
  node: ReferralNodeType;
  level?: number;
}
interface ReferralTreeProps {
  address: string;
}

const ReferralNode: React.FC<ReferralNodeProps> = ({ node, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!node) return null;

  const childrenCount = node.children?.length || 0;
  const backgroundColor = getBackgroundColor(level);

  return (
    <div className="w-full flex flex-col items-start mb-4 text-sm sm:text-base overflow-hidden">
      <div
        className="flex justify-between items-center w-full cursor-pointer"
        style={{ paddingLeft: level * 12 }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div
          className="text-white px-3 py-2 rounded-md flex items-center w-full hover:shadow-lg hover:scale-[1.02] transition-transform"
          style={{ backgroundColor }}
        >
          <span className="bg-gray-700 mr-2 text-white px-2 py-1 text-xs rounded">
            Lvl {level}
          </span>
          <span className="truncate flex-1">
            {node.address ? `${node.address.slice(0, 6)}...${node.address.slice(-4)}` : "N/A"}
          </span>
          <div className="bg-green-500 flex items-center text-white px-2 py-1 text-xs rounded ml-2 hover:bg-green-400">
            {childrenCount} {isExpanded ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
          </div>
        </div>
      </div>
      {isExpanded && node.children && (
        <div className="flex flex-col border-l-2 border-gray-400 pl-4 ml-2 mt-2 overflow-x-auto">
          {node.children.map((child, index) => (
            <ReferralNode key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const ReferralTree: React.FC<ReferralTreeProps> = ({ address }) => {
  const [tree, setTree] = useState<ReferralNodeType | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [isEnglish, setIsEnglish] = useState(true);

  useEffect(() => {
    async function loadTree() {
      if (!address) return;
      try {
        const fetchedTree = await fetchReferralTree(address);
        setTree(fetchedTree[0]);
        setQuantity(fetchedTree[1] - 1);
      } catch (error) {}
    }
    loadTree();
  }, [address]);

  return (
    <div className="p-6 sm:p-4 bg-green-800 bg-opacity-40 rounded-2xl w-full max-w-4xl mx-auto overflow-x-auto">
      <h1 className="text-xl sm:text-lg font-bold text-center mb-4">
        <button
          className="bg-[#ffea00c9] shadow-xl rounded-3xl w-[150px] h-[40px] font-semibold text-[18px] hover:bg-[#ffea00d5] transition-colors"
        >
          {isEnglish ? "Team" : "Equipo"}
        </button>
      </h1>
      <h1 className="my-2 text-center sm:text-left">
        {isEnglish ? "Total affiliated:" : "Total de afiliados:"} {quantity}
      </h1>
      {tree ? (
        <div className="flex flex-col items-start w-full overflow-x-auto">
          <ReferralNode node={tree} />
        </div>
      ) : (
        <p className="text-center text-gray-500">{isEnglish ? "Loading..." : "Cargando..."}</p>
      )}
    </div>
  );
};

export default ReferralTree;
